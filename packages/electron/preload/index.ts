import { contextBridge, ipcRenderer } from "electron"

export const electronIpcRenderer = {
    invoke: async (channel: string, ...params: Array<any>) => {
        return ipcRenderer.invoke(channel, ...params)
    },
}

contextBridge.exposeInMainWorld("electronIpcRenderer", electronIpcRenderer)
