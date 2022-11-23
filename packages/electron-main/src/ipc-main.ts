import { BrowserWindow, ipcMain } from "electron"

import type { IpcMainSender } from "@rino.app/electron-types"
import { IpcMainAsyncListener, IpcMainSyncListener } from "@rino.app/electron-types"

import {
    askBeforeDeleteSync,
    askMarkdownFileForClose,
    askMarkdownFileForOpen,
    askMarkdownFileForSave,
    askMarkdownFileForSaveSync,
    openFile,
    saveFile,
} from "./file"
import { state } from "./state"
import { closeWindow, createWindow } from "./window"

export function registerIpcListeners(): void {
    const asyncListener: IpcMainAsyncListener = {
        openFile: async (_, { path }) => {
            const filePath = path || (await askMarkdownFileForOpen())
            if (!filePath) return { canceled: true, path: "", content: "" }
            const content = await openFile(filePath)
            return { canceled: false, path: filePath, content }
        },

        saveFile: async (event, note) => {
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
        },

        askMarkdownFileForSave: async (event) => {
            const win = BrowserWindow.fromWebContents(event.sender)
            return await askMarkdownFileForSave(win)
        },

        askMarkdownFileForClose: async (event) => {
            const win = BrowserWindow.fromWebContents(event.sender)
            return await askMarkdownFileForClose(win)
        },

        newWindow: async (_) => {
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

        closeWindow: async (event) => {
            const win = BrowserWindow.fromWebContents(event.sender)
            if (!win) return
            closeWindow(win)
        },

        stopQuitting: async (_event) => {
            state.isQuitting = false
        },
    }

    const syncListener: IpcMainSyncListener = {
        askMarkdownFileForSaveSync: (event) => {
            const win = BrowserWindow.fromWebContents(event.sender)
            return askMarkdownFileForSaveSync(win)
        },

        askBeforeDeleteSync: (event) => {
            const win = BrowserWindow.fromWebContents(event.sender)
            return askBeforeDeleteSync(win)
        },
    }

    ipcMain.handle("RENDERER_TO_MAIN_ASYNC", async (event, type: keyof IpcMainAsyncListener, option: any) => {
        return await asyncListener[type](event, option)
    })

    ipcMain.on("RENDERER_TO_MAIN_SYNC", (event, type: keyof IpcMainSyncListener, option: any) => {
        event.returnValue = syncListener[type](event, option)
    })
}

export const ipcSender: IpcMainSender = new Proxy(
    {},
    {
        get: (_, type: keyof IpcMainSender) => {
            return async (window: BrowserWindow, option: any) => {
                return window.webContents.send("MAIN_TO_RENDEREER", type, option)
            }
        },
    },
) as any
