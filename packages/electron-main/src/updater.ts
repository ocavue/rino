import { app } from "electron"
import Store from "electron-store"
import { autoUpdater } from "electron-updater"
import crypto from "node:crypto"

import { sleep } from "@rino.app/common"

import { env } from "./env"
import { logger } from "./logger"
import { showMessageBoxOnFocusedWindow } from "./utils/dialog"

type StoreData = {
    uuid: string
    skippedVersions: string[]
    acceptAlpha: boolean
    acceptBeta: boolean
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

        let foundNewVersion = false
        try {
            autoUpdater.logger = logger
            autoUpdater.autoDownload = false
            const result = await autoUpdater.checkForUpdates()
            if (result) {
                const version = result.updateInfo.version
                logger.info(`found new version ${version}`)
                foundNewVersion = true

                const download = await showNewVersionDialog(version)
                logger.info(`user chose to ${download ? "download" : "skip"} version ${version}`)

                if (download) {
                    autoUpdater.autoDownload = true
                    await autoUpdater.checkForUpdatesAndNotify()
                }
            }
        } catch (error) {
            logger.error("failed to check or install updates automatically:", error)
            foundNewVersion = false
        }

        return foundNewVersion
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
    const foundNewVersion = await checkForUpdatesAndNotify(true)
    if (foundNewVersion) {
        await showNoUpdateDialog()
    }
}
