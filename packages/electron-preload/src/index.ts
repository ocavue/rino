import { contextBridge, IpcRenderer, ipcRenderer } from "electron"
import log from "electron-log"

contextBridge.exposeInMainWorld("ELECTRON_PRELOAD_ELECTRON_LOG", log)

const partialIpcRenderer: Pick<IpcRenderer, "invoke" | "sendSync" | "on" | "removeListener" | "removeAllListeners"> = {
    sendSync: (channel: string, ...params: Array<any>) => {
        return ipcRenderer.sendSync(channel, ...params)
    },
    invoke: async (channel: string, ...params: Array<any>) => {
        return ipcRenderer.invoke(channel, ...params)
    },
    on: (channel: string, listener: any) => {
        return ipcRenderer.on(channel, listener)
    },
    removeListener: (channel: string, listener: any) => {
        return ipcRenderer.removeListener(channel, listener)
    },
    removeAllListeners: (channel: string) => {
        return ipcRenderer.removeAllListeners(channel)
    },
}

contextBridge.exposeInMainWorld("ELECTRON_PRELOAD_IPC_RENDERER", partialIpcRenderer)
