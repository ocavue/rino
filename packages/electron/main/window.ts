import { BrowserWindow } from "electron"
import { join } from "path"
import { URL } from "url"

import { env } from "./env"
import { logger } from "./logger"

const windows = new Set<BrowserWindow>()

export async function createWindow() {
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
     * `file://../renderer/index.html` for production and test
     */
    const pageUrl = env.IS_DEV ? "http://localhost:3004" : new URL("../renderer/dist/index.html", "file://" + __dirname).toString()
    logger.info(`loading ${pageUrl}`)

    await newWindow.loadURL(pageUrl)
}
