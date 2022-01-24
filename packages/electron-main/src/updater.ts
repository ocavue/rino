import { app, shell } from "electron"
import Store from "electron-store"
import { autoUpdater } from "electron-updater"
import { find, sortBy } from "lodash-es"
import crypto from "node:crypto"
import fetch from "node-fetch"

import { createTimeoutPromise, sleep } from "@rino.app/common"

import { env } from "./env"
import { logger } from "./logger"
import { showMessageBoxOnFocusedWindow } from "./utils/dialog"

type ReleasePhase = "alpha" | "beta" | "latest"
type StoreData = {
    uuid: string
    skippedVersions: string[]
    acceptAlpha: boolean
    acceptBeta: boolean
}
type AvailableVersion = {
    version: string
    releaseDate: string
    releasePhase: ReleasePhase
}
type VersionRequest = {
    currentVersion: string
    store: StoreData
}

type VersionResponse = {
    availableVersions: AvailableVersion[]
}

let _store: Store<StoreData> | null = null

function initVersionUpdateStore(): Store<StoreData> {
    if (_store) return _store

    const schema = {
        uuid: {
            type: "string",
        },
        skippedVersions: {
            type: "array",
        },
        acceptAlpha: {
            type: "boolean",
        },
        acceptBeta: {
            type: "boolean",
        },
    } as const

    const store = new Store<StoreData>({
        name: "version-update",
        clearInvalidConfig: true,
        defaults: {
            uuid: "",
            skippedVersions: [],
            acceptAlpha: false,
            acceptBeta: false,
        },
        schema,
    })

    if (!store.get("uuid")) {
        const uuid = crypto.randomUUID()
        store.set("uuid", uuid)
    }
    _store = store
    return store
}

function skipVersion(version: string) {
    const store = initVersionUpdateStore()
    const skippedVersions = store.get("skippedVersions") || []
    if (!skippedVersions.includes(version)) {
        store.set("skippedVersions", [...skippedVersions, version])
    }
}

async function fetchAvailableVersions(): Promise<AvailableVersion[]> {
    const currentVersion = app.getVersion()
    const storeData = initVersionUpdateStore().store
    const req: VersionRequest = {
        currentVersion,
        store: storeData,
    }
    const res = await fetch("https://rino-api.vercel.app/api/version", {
        body: JSON.stringify(req),
        method: "POST",
    })
    const json = (await res.json()) as VersionResponse
    const availableVersions = sortBy(json.availableVersions, "releaseDate")
    return availableVersions.reverse()
}

async function fetchNewVersion(isManually: boolean): Promise<{ availableVersion?: AvailableVersion; shouldCheckForUpdates: boolean }> {
    try {
        const currentVersion = app.getVersion()
        const storeData = initVersionUpdateStore().store
        const availableVersions = await createTimeoutPromise(fetchAvailableVersions(), 15_000)

        if (availableVersions.length === 0) {
            return { shouldCheckForUpdates: true }
        }

        const currentVersionDate = find(availableVersions, (v) => v.version === currentVersion)?.releaseDate

        for (const availableVersion of availableVersions) {
            if (currentVersionDate && currentVersionDate >= availableVersion.releaseDate) {
                break
            }
            if (!isManually && storeData.skippedVersions.includes(availableVersion.version)) {
                logger.info(`skipping version ${availableVersion.version}`)
                break
            }

            if (availableVersion.releasePhase === "latest") {
                return { shouldCheckForUpdates: true, availableVersion }
            } else if (availableVersion.releasePhase === "beta" && storeData.acceptBeta) {
                return { shouldCheckForUpdates: true, availableVersion }
            } else if (availableVersion.releasePhase === "alpha" && storeData.acceptAlpha) {
                return { shouldCheckForUpdates: true, availableVersion }
            }
        }

        if (!currentVersionDate) {
            return { shouldCheckForUpdates: true }
        }

        const differenceInDays = (Date.now() - Date.parse(currentVersionDate)) / (1000 * 3600 * 24)
        return { shouldCheckForUpdates: differenceInDays >= 1.0 }
    } catch (err) {
        logger.warn("failed to check for new version:", err)
        return { shouldCheckForUpdates: true }
    }
}

async function showNewVersionDialog(version: string): Promise<boolean> {
    const { response } = await showMessageBoxOnFocusedWindow({
        message: `A new version of Rino is available: ${version}. Do you want to download now?`,
        type: "question",
        buttons: ["Yes", "Remind Me Later", "Skip This Version"],
        defaultId: 0,
        cancelId: 1,
    })
    if (response === 0) {
        return true
    }
    if (response === 2) {
        skipVersion(version)
    }
    return false
}

async function showNoUpdateDialog() {
    const message = `There are currently no updates available.`
    await showMessageBoxOnFocusedWindow({ message })
}

async function checkForUpdatesAndNotify(isManually: boolean): Promise<boolean> {
    if (env.IS_PROD) {
        logger.log("current environment is production, checking updates")

        await app.whenReady()

        const fetchNewVersionResult = await fetchNewVersion(isManually)
        logger.debug("fetched new version:", fetchNewVersionResult)
        const { shouldCheckForUpdates, availableVersion } = fetchNewVersionResult

        if (!shouldCheckForUpdates) {
            logger.info("not available version found")
            return false
        }

        let updated = false
        try {
            autoUpdater.logger = logger
            const result = await autoUpdater.checkForUpdatesAndNotify()
            if (result) {
                logger.info(`found new version ${result.updateInfo.version}`)
            }
            updated = !!result
        } catch (e) {
            logger.error("failed to check or install updates automatically:", e)
            updated = false
        }

        if (!updated && availableVersion) {
            const shouldInstall = await showNewVersionDialog(availableVersion.version)
            if (shouldInstall) {
                shell.openExternal(`https://rino.app`)
                return true
            }
        }
        return updated
    } else {
        logger.log("current environment is not production, skipping update check")
        return false
    }
}

export async function checkForUpdatesAutomatically(): Promise<void> {
    await sleep(1000)
    await checkForUpdatesAndNotify(false)
}

export async function checkForUpdatesManually(): Promise<void> {
    const hasUpdate = await checkForUpdatesAndNotify(true)
    if (hasUpdate) {
        await showNoUpdateDialog()
    }
}
