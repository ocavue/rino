import { app, Menu } from "electron"

import { registerIpcHandlers } from "./api-main"
import { buildApplicationMenu } from "./application-menu"
import { env, plateform } from "./env"
import { logger } from "./logger"
import { createWindow } from "./window"

async function setupAutoUpdate() {
    if (env.IS_PROD) {
        logger.log("current environment is production")

        await app.whenReady()
        await new Promise((resolve) => setTimeout(resolve, 1000))
        try {
            const { autoUpdater } = await import("electron-updater")
            autoUpdater.logger = logger
            await autoUpdater.checkForUpdatesAndNotify()
        } catch (e) {
            logger.error("failed to check updates:", e)
        }
    } else {
        logger.log("current environment is not production")
    }
}

async function init() {
    app.on("window-all-closed", () => {
        if (!plateform.IS_MAC) {
            app.quit()
        }
    })

    app.on("activate", (event, hasVisibleWindows) => {
        if (!hasVisibleWindows) {
            createWindow()
        }
    })

    app.on("ready", () => {
        Menu.setApplicationMenu(buildApplicationMenu())
        createWindow()
    })

    app.whenReady()
        .then(createWindow)
        .catch((e) => logger.error("failed to create window:", e))

    registerIpcHandlers()

    setupAutoUpdate()
}

init()
