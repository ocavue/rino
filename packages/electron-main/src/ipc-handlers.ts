import { BrowserWindow } from "electron"

import { askMarkdownFileForOpen, askMarkdownFileForSave, openFile, saveFile } from "./file"
import { ipcMain } from "./ipc-main"
import { createWindow } from "./window"

export function registerIpcInvokeHandlers() {
    ipcMain.handle("openFile", async (_, { path }) => {
        const filePath = path || (await askMarkdownFileForOpen())
        if (!filePath) return { canceled: true, path: "", content: "" }
        const content = await openFile(filePath)
        return { canceled: false, path: filePath, content }
    })

    ipcMain.handle("saveFile", async (_, note) => {
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

    ipcMain.handle("askMarkdownFileForSave", async (_) => {
        const filePath = await askMarkdownFileForSave()
        if (!filePath) {
            return { canceled: true, path: "" }
        }
        return { canceled: false, path: filePath }
    })

    ipcMain.handle("newWindow", async (_) => {
        await createWindow()
    })

    ipcMain.handle("getCurrentWindow", async (event) => {
        const win = BrowserWindow.fromWebContents(event.sender)
        if (!win) return null
        return {
            id: win.id,
            title: win.getTitle(),
        }
    })

    ipcMain.handle("setTitle", async (event, options) => {
        const win = BrowserWindow.fromWebContents(event.sender)
        if (!win) return
        win.setTitle(options.title)
    })
}
