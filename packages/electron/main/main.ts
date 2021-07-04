import { app, dialog, Menu, shell } from "electron"
import type { UpdateInfo } from "electron-updater"

import { registerIpcHandlers } from "./api-main"
import { buildApplicationMenu } from "./application-menu"
import { env, plateform } from "./env"
import { openFile } from "./file"
import { logger } from "./logger"
import { createWindow, createWindowByOpeningFile, createWindowIfNotExist } from "./window"

async function setupAutoUpdate() {
    if (env.IS_PROD) {
        logger.log("current environment is production, checking update")

        await app.whenReady()
        await new Promise((resolve) => setTimeout(resolve, 1000))
        try {
            const { autoUpdater } = await import("electron-updater")
            autoUpdater.logger = logger
            autoUpdater.autoDownload = false

            autoUpdater.on("update-available", async ({ version }: UpdateInfo) => {
                const result = await dialog.showMessageBox({
                    type: "question",
                    title: "New version available",
                    message: `Rino ${version} is now available. Would you like to download it now?`,
                    buttons: ["Download", "Remind Me Later"],
                })
                if (result.response === 0) {
                    shell.openExternal("https://github.com/ocavue/rino/releases")
                }
            })

            await autoUpdater.checkForUpdates()
        } catch (e) {
            logger.error("failed to check updates:", e)
        }
    } else {
        logger.log("current environment is not production, skipping update")
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
