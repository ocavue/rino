import { contextBridge } from "electron"
import { ipcRenderer } from "electron"

export const electronIpcRenderer = {
    invoke: ipcRenderer.invoke.bind(ipcRenderer),
}

contextBridge.exposeInMainWorld("electronIpcRenderer", electronIpcRenderer)
