import type { IpcRenderer } from "electron"

import type { InvokeRendererAPI } from "../types/api"

const ipcRenderer: {
    invoke: IpcRenderer["invoke"]
} = (window as any)["electronIpcRenderer"]

const invokeAPI = new Proxy(
    {},
    {
        get: (_, channel: string) => {
            return async (...params: unknown[]) => {
                return await ipcRenderer.invoke("invoke:" + channel, ...params)
            }
        },
    },
) as InvokeRendererAPI

export const ipc = invokeAPI
