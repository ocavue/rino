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

async function newWindow(): Promise<void> {
    await ipcRenderer.invoke("new_window")
}

export const electronIpcApi: ElectronIpcApi = { openFile, newWindow }
