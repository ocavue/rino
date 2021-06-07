import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron"

import { PreloadIpcRenderer } from "../types/api"

export const electronIpcRenderer: PreloadIpcRenderer = {
    invoke: async (channel: string, ...params: Array<any>) => {
        return ipcRenderer.invoke(channel, ...params)
    },
    on: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => {
        ipcRenderer.on(channel, listener)
    },
}

contextBridge.exposeInMainWorld("electronIpcRenderer", electronIpcRenderer)
