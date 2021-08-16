import { useEffect } from "react"

import { ipcRenderer } from "../ipc-renderer"

export function useIpcRendererHandlers({
    openFile,
    ensureFilePath,
    setNotePath,
    beforeCloseWindow,
}: {
    openFile: (path: string) => void
    ensureFilePath: () => void
    setNotePath: (path: string) => void
    beforeCloseWindow: () => void
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

    useEffect(() => {
        ipcRenderer.on("beforeCloseWindow", (event) => {
            beforeCloseWindow()
        })
        return () => {
            ipcRenderer.removeAllListeners("beforeCloseWindow")
        }
    }, [beforeCloseWindow])
}
