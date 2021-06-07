import { ipcRenderer } from "electron"

import type { ElectronIpcApi } from "../types/api"

async function openFile(): Promise<{ canceled: boolean; path: string; content: string }> {
    return await ipcRenderer.invoke("open_file")
}

async function saveFile(options: { path: string; content: string }): Promise<{ canceled: boolean; path: string }> {
    return await ipcRenderer.invoke("save_file", options)
}

async function newWindow(): Promise<void> {
    return await ipcRenderer.invoke("new_window")
}

async function getCurrentWindow(): Promise<{ id: string; title: string } | null> {
    return await ipcRenderer.invoke("get_current_window")
}

async function setTitle(options: { title: string }): Promise<void> {
    return await ipcRenderer.invoke("set_title", options)
}

export const electronIpcApi: ElectronIpcApi = { openFile, saveFile, newWindow, getCurrentWindow, setTitle }
