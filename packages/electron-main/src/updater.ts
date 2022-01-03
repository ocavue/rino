import { app, BrowserWindow, dialog } from "electron"
import { autoUpdater } from "electron-updater"

import { env } from "./env"
import { logger } from "./logger"

async function checkForUpdatesAndNotify(): Promise<boolean> {
    if (env.IS_PROD) {
        logger.log("current environment is production, checking updates")

        await app.whenReady()
        try {
            autoUpdater.logger = logger
            const result = await autoUpdater.checkForUpdatesAndNotify()
            return !!result
        } catch (e) {
            logger.error("failed to check updates:", e)
            return false
        }
    } else {
        logger.log("current environment is not production, skipping update check")
        return false
    }
}

export async function checkForUpdatesAutomatically(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 6000))
    await checkForUpdatesAndNotify()
}

export async function checkForUpdatesManually(): Promise<void> {
    const hasUpdate = await checkForUpdatesAndNotify()
    if (!hasUpdate) {
        const message = `There are currently no updates available.`
        const currentWindow = BrowserWindow.getFocusedWindow()
        if (currentWindow) {
            await dialog.showMessageBox(currentWindow, { message })
        } else {
            await dialog.showMessageBox({ message })
        }
    }
}
