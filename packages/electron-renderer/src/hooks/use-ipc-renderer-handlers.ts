import { RefObject, useCallback, useEffect, useRef } from "react"

import { sleep } from "@rino.app/common"
import { EditorHandle, Mode } from "@rino.app/editor"
import { IpcRendererReceiver } from "@rino.app/electron-types"

import { ipcRendererV2 } from "../ipc-renderer"

export function useIpcRendererHandlers({
    openFile,
    ensureFilePath,
    setNotePath,
    closeWindow,
    editorRef,
}: {
    openFile: (props: { path: string; content: string }) => void
    ensureFilePath: () => void
    setNotePath: (props: { path: string }) => void
    closeWindow: () => void
    editorRef: RefObject<EditorHandle>
}) {
    const beforeExportToPdf = useCallback(async () => {
        editorRef.current?.switchMode(Mode.WYSIWYG)
        editorRef.current?.resetSelection()
        await sleep(0) // wait for the `resetSelection` to be applied
        ;(document.activeElement as HTMLElement | null)?.blur()
    }, [editorRef])

    const receiver: IpcRendererReceiver = {
        openFile,
        ensureFilePath,
        setNotePath,
        beforeCloseWindow: closeWindow,
        beforeExportToPdf,
    }

    const ipcRendererReceiver = useRef<IpcRendererReceiver>(receiver)
    ipcRendererReceiver.current = receiver

    useEffect(() => {
        ipcRendererV2.on("MAIN_TO_RENDEREER", (event, type: keyof IpcRendererReceiver, options: any) => {
            return ipcRendererReceiver.current[type](options)
        })
        return () => {
            ipcRendererV2.removeAllListeners("MAIN_TO_RENDEREER")
        }
    }, [])
}
