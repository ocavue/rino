import { contextBridge, ipcRenderer } from "electron"
import log from "electron-log"

import type { InvokeApi, IpcRenderer, SendApi, SyncInvokeApi } from "@rino.app/electron-types"

contextBridge.exposeInMainWorld("ELECTRON_PRELOAD_ELECTRON_LOG", log)

const electronIpcRenderer: IpcRenderer<SendApi, InvokeApi, SyncInvokeApi> = {
    invoke: async (channel, ...params: Array<any>) => {
        return ipcRenderer.invoke(channel, ...params)
    },
    invokeSync: (channel, ...params: Array<any>) => {
        return ipcRenderer.sendSync(channel, ...params)
    },
    on: (channel, listener: any) => {
        ipcRenderer.on(channel, listener)
    },
    removeListener: (channel, listener: any) => {
        ipcRenderer.removeListener(channel, listener)
    },
    removeAllListeners: (channel) => {
        ipcRenderer.removeAllListeners(channel)
    },
}

contextBridge.exposeInMainWorld("ELECTRON_PRELOAD_IPC_RENDERER", electronIpcRenderer)
