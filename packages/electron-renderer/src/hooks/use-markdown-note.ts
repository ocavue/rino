import { useCallback, useEffect, useState } from "react"

import { ipcInvoker } from "../ipc-renderer"
import { logger } from "../logger"
import { MarkdownNote } from "../types"
import { useTitle } from "./use-title"

export function useMarkdownNote() {
    const [closing, setClosing] = useState(false)
    const [note, setNote] = useState<MarkdownNote>({ content: "", path: "", deleted: false })
    const { title, setSaved } = useTitle(note.path)

    useEffect(() => {
        ipcInvoker.setTitle({ title })
    }, [title])

    const openFile = useCallback(async (path?: string) => {
        const file = await ipcInvoker.openFile({ path })
        if (!file.canceled) {
            setNote({ content: file.content, deleted: false, path: file.path })
        }
    }, [])

    const onContentSave = useCallback((content: string) => {
        setNote((note) => {
            return { ...note, content }
        })
    }, [])

    const onContentEdit = useCallback(() => {
        setSaved(false)
    }, [setSaved])

    const setNotePath = useCallback((path: string) => {
        if (path) setNote((note) => ({ ...note, path }))
    }, [])

    const saveNoteAndMaybeClose = useCallback(
        async (note: MarkdownNote) => {
            const { filePath } = await ipcInvoker.saveFile({ content: note.content, path: note.path })
            if (filePath) {
                setSaved(true)
                if (note.path !== filePath) {
                    setNotePath(filePath)
                }
                if (closing) {
                    await ipcInvoker.closeWindow()
                }
            }
        },
        [closing, setNotePath, setSaved],
    )

    useEffect(() => {
        if (note.path) {
            saveNoteAndMaybeClose(note)
        }
    }, [note, saveNoteAndMaybeClose])

    const ensureFilePath = useCallback(async () => {
        if (!note.path) {
            const { filePath } = await ipcInvoker.askMarkdownFileForSave()
            if (filePath) {
                setNotePath(filePath)
            }
        }
    }, [note.path, setNotePath])

    const beforeCloseWindow = useCallback(async (): Promise<void> => {
        logger.debug("beforeCloseWindow")

        if (!note.path) {
            if (!note.content) {
                setClosing(true)
                await ipcInvoker.closeWindow()
            } else {
                const { filePath, deleted } = await ipcInvoker.askMarkdownFileForClose()
                if (deleted) {
                    setClosing(true)
                    await ipcInvoker.closeWindow()
                } else if (filePath) {
                    setClosing(true)
                    setNotePath(filePath)
                } else {
                    // users cancel the closing
                }
            }
        } else {
            setClosing(true)
            await ipcInvoker.closeWindow()
        }
    }, [note.content, note.path, setNotePath])

    return { note, openFile, setNotePath, onContentSave, onContentEdit, ensureFilePath, beforeCloseWindow, closing }
}
