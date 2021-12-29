import { app } from "electron"
import { autoUpdater } from "electron-updater"

import { env } from "./env"
import { logger } from "./logger"

export async function setupAutoUpdate() {
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
