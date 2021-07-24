import { app, BrowserWindow } from "electron"
import { join } from "path"
import { URL } from "url"

import { env } from "./env"
import { logger } from "./logger"

const windows = new Set<BrowserWindow>()

export async function createWindow() {
    try {
        logger.info("creating new window")
        await app.whenReady()

        let x: number | undefined, y: number | undefined
        const currentWindow = BrowserWindow.getFocusedWindow()
        if (currentWindow) {
            const [currentWindowX, currentWindowY] = currentWindow.getPosition()
            x = currentWindowX + 32
            y = currentWindowY + 32
        }

        const newWindow = new BrowserWindow({
            x,
            y,
            show: false,
            webPreferences: {
                preload: join(__dirname, "../../preload/dist/index.js"),
            },
        })

        newWindow.once("ready-to-show", () => {
            newWindow?.show()
        })

        newWindow.on("closed", () => {
            windows.delete(newWindow)
        })

        if (env.IS_DEV) {
            setTimeout(() => {
                newWindow?.webContents.openDevTools({ activate: false, mode: "detach" })
            }, 1000)
        }

        /**
         * URL for main window.
         * Vite dev server for development.
         * Local files for production and test
         */
        const pageUrl = env.IS_DEV
            ? "http://localhost:3004"
            : new URL("../node_modules/@rino.app/electron-renderer/dist/index.html", "file://" + __dirname).toString()
        logger.info(`loading ${pageUrl}`)

        await newWindow.loadURL(pageUrl)
        logger.info("created new window")

        return newWindow
    } catch (error) {
        logger.error("failed to create new window:", error)
        throw error
    }
}

export async function createWindowByOpeningFile(path: string) {
    if (!path) return
    const win = await createWindow()
    win.webContents.send("send:openFile", { path })
}

export async function createWindowIfNotExist() {
    logger.debug(`current windows number: ${windows.size}`)
    if (windows.size === 0) {
        logger.debug("creating a window")
        await createWindow()
    }
}
