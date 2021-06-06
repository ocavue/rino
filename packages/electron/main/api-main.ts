import { BrowserWindow, ipcMain } from "electron"

import { askMarkdownFileForOpen, askMarkdownFileForSave, openFile, saveFile } from "./file"
import { createWindow } from "./window"

export function registerIpcHandlers() {
    ipcMain.handle("open_file", async (event) => {
        const path = await askMarkdownFileForOpen()
        const content = await openFile(path)
        return { path, content }
    })

    ipcMain.handle("save_file", async (event, note) => {
        let filePath: string | undefined = note.path
        if (!filePath) {
            filePath = await askMarkdownFileForSave()
        }
        if (!filePath) {
            return { canceled: true, path: "" }
        }
        await saveFile(filePath, note.content)
        return { canceled: false, path: filePath }
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
