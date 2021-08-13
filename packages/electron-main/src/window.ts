import { app, BrowserWindow } from "electron"
import { join } from "path"
import { URL } from "url"

import { env } from "./env"
import { ipcSender } from "./ipc-main"
import { logger } from "./logger"

const windows = new Set<BrowserWindow>()

function calcNewWindowSize() {
    const currentWindow = BrowserWindow.getFocusedWindow()
    if (currentWindow) {
        const [x, y] = currentWindow.getPosition()
        const [width, height] = currentWindow.getSize()
        return { x: x + 30, y: y + 30, width, height }
    }
    return null
}

export async function createWindow() {
    try {
        logger.info("creating new window")
        await app.whenReady()

        const preloadEntry = join(__dirname, "../../electron-preload/dist/index.js")
        const rendererEntry = join(__dirname, "../../electron-renderer/dist/index.html")

        const newWindow = new BrowserWindow({
            ...calcNewWindowSize(),
            show: true,
            title: "Rino",
            webPreferences: {
                preload: preloadEntry,
            },
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
         * Local files for production.
         */
        const pageUrl = env.IS_DEV ? "http://localhost:3004" : new URL(rendererEntry, "file://").toString()
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
    ipcSender.openFile(win, { path })
}

export async function createWindowIfNotExist() {
    logger.debug(`current windows number: ${windows.size}`)
    if (windows.size === 0) {
        logger.debug("creating a window")
        await createWindow()
    }
}
