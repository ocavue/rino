import { ipcRenderer } from "electron"
import { isString } from "lodash"

import type { ElectronIpcApi } from "../types/api"
import { logger } from "./logger"

async function openFile(): Promise<{ path: string; content: string }> {
    const result = await ipcRenderer.invoke("open_file")
    if (result && isString(result.path) && isString(result.content)) {
        logger.info(`received file content from ${result.path}`)
        return result
    } else {
        throw new Error("invalid result")
    }
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
