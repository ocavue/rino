import { useCallback, useEffect, useState } from "react"

import { ipcInvoker } from "../ipc-renderer"
import { MarkdownNote } from "../types"
import { useTitle } from "./use-title"

export function useMarkdownNote() {
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

    const onContentSave = useCallback(
        (content: string) => {
            setSaved(true)
            setNote((note) => {
                return { ...note, content }
            })
        },
        [setSaved],
    )

    const onContentEdit = useCallback(() => {
        setSaved(false)
    }, [setSaved])

    const setNotePath = useCallback((path: string) => {
        if (path) setNote((note) => ({ ...note, path }))
    }, [])

    const saveNote = useCallback(
        async (note: MarkdownNote) => {
            const { canceled, path } = await ipcInvoker.saveFile({ content: note.content, path: note.path })

            if (canceled) return

            setSaved(true)

            if (path && note.path !== path) {
                setNotePath(path)
            }
        },
        [setNotePath, setSaved],
    )

    useEffect(() => {
        if (note.path) {
            saveNote(note)
        }
    }, [note, saveNote])

    const ensureFilePath = useCallback(async () => {
        if (!note.path) {
            const { path, canceled } = await ipcInvoker.askMarkdownFileForSave()
            if (!canceled) {
                setNotePath(path)
            }
        }
    }, [note.path, setNotePath])

    return { note, openFile, setNotePath, onContentSave, onContentEdit, ensureFilePath }
}
