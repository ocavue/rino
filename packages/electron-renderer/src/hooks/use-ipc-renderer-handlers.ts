import { RefObject, useEffect } from "react"

import { sleep } from "@rino.app/common"
import { EditorHandle, Mode } from "@rino.app/editor"

import { ipcRenderer } from "../ipc-renderer"

export function useIpcRendererHandlers({
    openFile,
    ensureFilePath,
    setNotePath,
    closeWindow,
    editorRef,
}: {
    openFile: (props: { path: string; content: string }) => void
    ensureFilePath: () => void
    setNotePath: (path: string) => void
    closeWindow: () => void
    editorRef: RefObject<EditorHandle>
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

    useEffect(() => {
        ipcRenderer.on("beforeExportToPdf", async (event) => {
            editorRef.current?.switchMode(Mode.WYSIWYG)
            editorRef.current?.resetSelection()
            await sleep(0) // wait for the `resetSelection` to be applied
            ;(document.activeElement as HTMLElement | null)?.blur()
        })
        return () => {
            ipcRenderer.removeAllListeners("beforeExportToPdf")
        }
    }, [editorRef])
}
