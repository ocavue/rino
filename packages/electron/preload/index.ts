import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron"

import { PreloadIpcRenderer } from "../types/api"

const electronIpcRenderer: PreloadIpcRenderer = {
    invoke: async (channel: string, ...params: Array<any>) => {
        return ipcRenderer.invoke(channel, ...params)
    },
    on: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => {
        ipcRenderer.on(channel, listener)
    },
    removeAllListeners: (channel: string) => {
        ipcRenderer.removeAllListeners(channel)
    },
}

contextBridge.exposeInMainWorld("electronIpcRenderer", electronIpcRenderer)
