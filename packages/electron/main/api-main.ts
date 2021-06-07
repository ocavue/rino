import { BrowserWindow, ipcMain } from "electron"

import { InvokeMainAPI } from "../types/api"
import { askMarkdownFileForOpen, askMarkdownFileForSave, openFile, saveFile } from "./file"
import { createWindow } from "./window"

const invokeMainAPI: InvokeMainAPI = {
    openFile: async (event, { path }) => {
        const filePath = path || (await askMarkdownFileForOpen())
        if (!filePath) return { canceled: true, path: "", content: "" }
        const content = await openFile(filePath)
        return { canceled: false, path: filePath, content }
    },

    saveFile: async (event, note) => {
        let filePath: string | undefined = note.path
        if (!filePath) {
            filePath = await askMarkdownFileForSave()
        }
        if (!filePath) {
            return { canceled: true, path: "" }
        }
        await saveFile(filePath, note.content)
        return { canceled: false, path: filePath }
    },

    newWindow: async (event) => {
        await createWindow()
    },

    getCurrentWindow: async (event) => {
        const win = BrowserWindow.fromWebContents(event.sender)
        if (!win) return null
        return {
            id: win.id,
            title: win.getTitle(),
        }
    },

    setTitle: async (event, options) => {
        const win = BrowserWindow.fromWebContents(event.sender)
        if (!win) return
        win.setTitle(options.title)
    },
}

export function registerIpcHandlers() {
    for (const [channel, handler] of Object.entries(invokeMainAPI)) {
        ipcMain.handle("invoke:" + channel, handler)
    }
}
