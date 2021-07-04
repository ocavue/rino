import { app, dialog, Menu, shell } from "electron"
import type { UpdateInfo } from "electron-updater"

import { registerIpcHandlers } from "./api-main"
import { buildApplicationMenu } from "./application-menu"
import { env, plateform } from "./env"
import { openFile } from "./file"
import { logger } from "./logger"
import { createWindow, createWindowByOpeningFile, createWindowIfNotExist } from "./window"

async function showUpdateDialog(version: string) {
    // dialog module can only be used after app is ready
    await app.whenReady()
    const result = await dialog.showMessageBox({
        type: "question",
        title: "New version available",
        message: "New version available",
        detail: `Rino ${version} is now available. Would you like to download it now?`,
        buttons: ["Remind Me Later", "Download"],
        defaultId: 1,
        cancelId: 0,
    })
    if (result.response === 1) {
        await shell.openExternal("https://github.com/ocavue/rino/releases")
    }
}

async function setupAutoUpdate() {
    if (env.IS_PROD) {
        logger.log("current environment is production, checking updates")

        await app.whenReady()
        await new Promise((resolve) => setTimeout(resolve, 1000))
        try {
            const { autoUpdater } = await import("electron-updater")
            autoUpdater.logger = logger
            autoUpdater.autoDownload = false
            autoUpdater.on("update-available", ({ version }: UpdateInfo) => showUpdateDialog(version))
            await autoUpdater.checkForUpdates()
        } catch (e) {
            logger.error("failed to check updates:", e)
        }
    } else {
        logger.log("current environment is not production, skipping update check")
    }
}

async function init() {
    let openingFile = false

    app.on("will-finish-launching", () => {
        logger.info("event triggered: will-finish-launching")
        app.on("open-file", (event, path) => {
            logger.info("event triggered: open-file", { path })
            openingFile = true
            event.preventDefault()
            createWindowByOpeningFile(path)
        })
    })

    app.on("window-all-closed", () => {
        logger.info("event triggered: window-all-closed")
        if (!plateform.IS_MAC) {
            app.quit()
        }
    })

    app.on("activate", (event, hasVisibleWindows) => {
        logger.info("event triggered: activate")
        if (!hasVisibleWindows) {
            createWindow()
        }
    })

    app.on("ready", () => {
        logger.info("event triggered: ready", { openingFile })
        Menu.setApplicationMenu(buildApplicationMenu())
        if (!openFile) {
            createWindowIfNotExist()
        }
    })

    registerIpcHandlers()

    setupAutoUpdate()
}

init()
