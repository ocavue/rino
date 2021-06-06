import { app } from "electron"

import { env } from "./env"
import { registerIpcHandlers } from "./ipc-main"
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
        if (process.platform !== "darwin") {
            app.quit()
        }
    })

    app.on("activate", (event, hasVisibleWindows) => {
        if (!hasVisibleWindows) {
            createWindow()
        }
    })

    app.whenReady()
        .then(createWindow)
        .catch((e) => logger.error("failed to create window:", e))

    registerIpcHandlers()

    setupAutoUpdate()
}

init()
