import { app, Menu } from "electron"
import { autoUpdater } from "electron-updater"

import { buildApplicationMenu } from "./application-menu"
import { env, plateform } from "./env"
import { registerIpcInvokeHandlers } from "./ipc-handlers"
import { logger } from "./logger"
import { createWindow, createWindowByOpeningFile, createWindowIfNotExist } from "./window"

async function setupAutoUpdate() {
    if (env.IS_PROD) {
        logger.log("current environment is production, checking updates")

        await app.whenReady()
        await new Promise((resolve) => setTimeout(resolve, 1000))
        try {
            autoUpdater.logger = logger
            await autoUpdater.checkForUpdatesAndNotify()
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
        if (!openingFile) {
            createWindowIfNotExist()
        }
    })

    registerIpcInvokeHandlers()

    setupAutoUpdate()
}

init()
