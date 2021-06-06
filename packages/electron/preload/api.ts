import { ipcRenderer } from "electron"
import { isString } from "lodash"

import type { ElectronApi } from "../types/api"
import { logger } from "./logger"

async function openFile(): Promise<{ path: string; content: string } | null> {
    const result = await ipcRenderer.invoke("open-file")
    if (result && isString(result.path) && isString(result.content)) {
        logger.info(`received file content from ${result.path}`)
        return result
    } else {
        logger.info(`failed to invoke open-file. result: ${result}`)
        return null
    }
}

export const electronApi: ElectronApi = { openFile }
