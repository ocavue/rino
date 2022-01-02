import { app, BrowserWindow } from "electron"
import { BrowserWindowConstructorOptions } from "electron/main"
import { join } from "node:path"
import { URL } from "node:url"

import { env } from "./env"
import { openFile } from "./file"
import { ipcSender } from "./ipc-main"
import { logger } from "./logger"

const windows = new Set<BrowserWindow>()
const closingWindows = new Set<BrowserWindow>()

function calcNewWindowSize(): BrowserWindowConstructorOptions {
    const currentWindow = BrowserWindow.getFocusedWindow()
    if (currentWindow) {
        const [x, y] = currentWindow.getPosition()
        const [width, height] = currentWindow.getSize()
        return { x: x + 30, y: y + 30, width, height }
    }
    return {
        // The default width of the save file dialog is 800. The default window width is also 800.
        // So we set the window width to be slightly larger than 800 to make a bit padding between
        // the window and the save file dialog.
        width: 860,
    }
}

export async function createWindow() {
    try {
        logger.info("creating new window")
        await app.whenReady()

        const preloadEntry = join(__dirname, "../../electron-preload/dist/electron-preload.js")
        const rendererEntry = join(__dirname, "../../electron-renderer/dist/index.html")

        const newWindow = new BrowserWindow({
            ...calcNewWindowSize(),
            show: true,
            title: "Rino",
            webPreferences: {
                preload: preloadEntry,

                // I need to disable web security in dev mode to load local image files
                // https://stackoverflow.com/a/50319258/9426588
                webSecurity: !env.IS_DEV,
            },
        })

        newWindow.on("close", (event) => {
            logger.info(`window (id=${newWindow.id}) event triggered: close`)
            if (!closingWindows.has(newWindow)) {
                logger.info(`try to close window id=${newWindow.id}`)
                event.preventDefault()
                ipcSender.beforeCloseWindow(newWindow)
            } else {
                logger.info(`closing window id=${newWindow.id}`)
                windows.delete(newWindow)
                closingWindows.delete(newWindow)
            }
        })

        // if (env.IS_DEV) {
        //     setTimeout(() => {
        //         newWindow?.webContents.openDevTools({ activate: false, mode: "detach" })
        //     }, 1000)
        // }

        /**
         * URL for main window.
         * Vite dev server for development.
         * Local files for production.
         */
        const pageUrl = env.IS_DEV ? "http://localhost:3004" : new URL(rendererEntry, "file://").toString()
        logger.info(`loading ${pageUrl} for window id=${newWindow.id}`)

        await newWindow.loadURL(pageUrl)
        logger.info(`created new window id=${newWindow.id}`)

        return newWindow
    } catch (error) {
        logger.error("failed to create new window:", error)
        throw error
    }
}

export async function createWindowByOpeningFile(path: string) {
    if (!path) return
    const win = await createWindow()
    const content = await openFile(path)
    ipcSender.openFile(win, { path, content })
}

export async function createWindowIfNotExist() {
    logger.debug(`current windows number: ${windows.size}`)
    if (windows.size === 0) {
        logger.debug("creating a window")
        await createWindow()
    }
}

export function closeWindow(win: BrowserWindow) {
    closingWindows.add(win)
    win.close()
}
