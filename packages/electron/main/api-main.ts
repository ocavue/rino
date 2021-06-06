import { BrowserWindow, ipcMain } from "electron"

import { getMarkdownFileFromUser, openFile } from "./file"
import { createWindow } from "./window"

export function registerIpcHandlers() {
    ipcMain.handle("open_file", async (event) => {
        const path = await getMarkdownFileFromUser()
        const content = await openFile(path)
        return { path, content }
    })

    ipcMain.handle("new_window", async (event) => {
        await createWindow()
    })

    ipcMain.handle("get_current_window", async (event) => {
        const win = BrowserWindow.fromWebContents(event.sender)
        if (!win) return null
        return {
            id: win.id,
            title: win.getTitle(),
        }
    })

    ipcMain.handle("set_title", async (event, options) => {
        const win = BrowserWindow.fromWebContents(event.sender)
        if (!win) return null
        win.setTitle(options.title)
    })
}
