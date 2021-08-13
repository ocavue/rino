import { useEffect } from "react"

import { ipcRenderer } from "../ipc-renderer"

export function useIpcRendererHandlers({
    openFile,
    ensureFilePath,
    setNotePath,
}: {
    openFile: (path: string) => void
    ensureFilePath: () => void
    setNotePath: (path: string) => void
}) {
    useEffect(() => {
        ipcRenderer.on("openFile", (event, { path }) => {
            openFile(path)
        })
        return () => {
            ipcRenderer.removeAllListeners("openFile")
        }
    }, [openFile])

    useEffect(() => {
        ipcRenderer.on("ensureFilePath", (event) => {
            ensureFilePath()
        })
        return () => {
            ipcRenderer.removeAllListeners("ensureFilePath")
        }
    }, [ensureFilePath])

    useEffect(() => {
        ipcRenderer.on("setNotePath", (event, { path }) => {
            setNotePath(path)
        })
        return () => {
            ipcRenderer.removeAllListeners("setNotePath")
        }
    }, [setNotePath])
}
