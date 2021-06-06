import { app, BrowserWindow } from "electron"
import { join } from "path"
import { URL } from "url"

import { env } from "./env"
import { registerIpcHandlers } from "./ipc-main"
import { logger } from "./logger"

async function setupAutoUpdate() {
    if (env.PROD) {
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

const lock = app.requestSingleInstanceLock()

if (!lock) {
    app.quit()
} else {
    /**
     * Workaround for TypeScript bug
     * @see https://github.com/microsoft/TypeScript/issues/41468#issuecomment-727543400
     */

    let mainWindow: BrowserWindow | null = null

    const createWindow = async () => {
        mainWindow = new BrowserWindow({
            show: false,
            webPreferences: {
                preload: join(__dirname, "../../preload/dist/index.js"),
            },
        })

        mainWindow.once("ready-to-show", () => {
            mainWindow?.show()
        })

        mainWindow.on("closed", () => {
            mainWindow = null
        })

        if (env.MODE === "development") {
            setTimeout(() => {
                mainWindow?.webContents.openDevTools({ activate: false, mode: "detach" })
            }, 1000)
        }

        /**
         * URL for main window.
         * Vite dev server for development.
         * `file://../renderer/index.html` for production and test
         */
        const pageUrl =
            env.MODE === "development" ? "http://localhost:3004" : new URL("../renderer/dist/index.html", "file://" + __dirname).toString()

        await mainWindow.loadURL(pageUrl)
    }

    app.on("second-instance", () => {
        // Someone tried to run a second instance, we should focus our window.
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }
    })

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            app.quit()
        }
    })

    app.whenReady()
        .then(createWindow)
        .catch((e) => logger.error("failed create window:", e))

    // Auto-updates
    setupAutoUpdate()

    registerIpcHandlers()
}
