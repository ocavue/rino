import { BrowserWindow } from "electron"

import { askMarkdownFileForClose, askMarkdownFileForOpen, askMarkdownFileForSave, openFile, saveFile } from "./file"
import { ipcMain } from "./ipc-main"
import { state } from "./state"
import { closeWindow, createWindow } from "./window"

export function registerIpcInvokeHandlers(): void {
    ipcMain.handle("openFile", async (_, { path }) => {
        const filePath = path || (await askMarkdownFileForOpen())
        if (!filePath) return { canceled: true, path: "", content: "" }
        const content = await openFile(filePath)
        return { canceled: false, path: filePath, content }
    })

    ipcMain.handle("saveFile", async (event, note) => {
        let filePath: string | undefined = note.path
        if (!filePath) {
            const win = BrowserWindow.fromWebContents(event.sender)
            filePath = (await askMarkdownFileForSave(win)).filePath
        }
        if (!filePath) {
            return { canceled: true }
        }
        await saveFile(filePath, note.content)
        return { canceled: false, filePath }
    })

    ipcMain.handle("askMarkdownFileForSave", async (event) => {
        const win = BrowserWindow.fromWebContents(event.sender)
        return await askMarkdownFileForSave(win)
    })

    ipcMain.handle("askMarkdownFileForClose", async (event) => {
        const win = BrowserWindow.fromWebContents(event.sender)
        return await askMarkdownFileForClose(win)
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

    ipcMain.handle("closeWindow", async (event) => {
        const win = BrowserWindow.fromWebContents(event.sender)
        if (!win) return
        closeWindow(win)
    })

    ipcMain.handle("stopQuitting", async (event) => {
        state.isQuitting = false
    })
}
