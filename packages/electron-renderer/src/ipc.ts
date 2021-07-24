import { useEffect } from "react"

import type { InvokeRendererAPI, PreloadIpcRenderer } from "@rino.app/electron-types"

// @ts-expect-error `window` doesn't have `electronIpcRenderer`
const ipcRenderer: PreloadIpcRenderer = window["electronIpcRenderer"]

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

export function useIpcSendHandelrs({
    openFile,
    ensureFilePath,
    setNotePath,
}: {
    openFile: (path: string) => void
    ensureFilePath: () => void
    setNotePath: (path: string) => void
}) {
    useEffect(() => {
        ipcRenderer.on("send:openFile", (event, { path }) => {
            openFile(path)
        })
        return () => {
            ipcRenderer.removeAllListeners("send:openFile")
        }
    }, [openFile])

    useEffect(() => {
        ipcRenderer.on("send:ensureFilePath", (event) => {
            ensureFilePath()
        })
        return () => {
            ipcRenderer.removeAllListeners("send:ensureFilePath")
        }
    }, [ensureFilePath])

    useEffect(() => {
        ipcRenderer.on("send:setNotePath", (event, { path }) => {
            setNotePath(path)
        })
        return () => {
            ipcRenderer.removeAllListeners("send:setNotePath")
        }
    }, [setNotePath])
}
