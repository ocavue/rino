import type { InvokeRendererAPI, PreloadIpcRenderer } from "../types/api"

const ipcRenderer: PreloadIpcRenderer = (window as any)["electronIpcRenderer"]

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

export function registerIpcHandlers(openFile: (path: string) => void, setNotePath: (path: string) => void) {
    ipcRenderer.on("send:openFile", (event, { path }) => {
        openFile(path)
    })

    ipcRenderer.on("send:setNotePath", (event, { path }) => {
        setNotePath(path)
    })
}
