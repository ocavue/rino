import { useEffect } from "react"

import { ipcRenderer } from "../ipc-renderer"

export function useIpcRendererHandlers({
    openFile,
    ensureFilePath,
    setNotePath,
    closeWindow,
}: {
    openFile: (props: { path: string; content: string }) => void
    ensureFilePath: () => void
    setNotePath: (path: string) => void
    closeWindow: () => void
}) {
    useEffect(() => {
        ipcRenderer.on("openFile", (event, { path, content }) => {
            openFile({ path, content })
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
            closeWindow()
        })
        return () => {
            ipcRenderer.removeAllListeners("beforeCloseWindow")
        }
    }, [closeWindow])
}
