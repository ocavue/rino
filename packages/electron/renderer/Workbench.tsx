import React, { FC, useCallback, useEffect, useState } from "react"

import { basename } from "@rino.app/common"
import { Editor } from "@rino.app/editor"

import { ipc, registerIpcHandlers } from "./ipc"

const drawerActivityContainer = {
    useContainer: () => ({
        drawerActivity: false,
    }),
}

interface Note {
    content: string
    path: string
    deleted: boolean
}

function useMarkdownNote() {
    const [note, setNote] = useState<Note>({ content: "", path: "", deleted: false })
    const [edited, setEdited] = useState(false)

    useEffect(() => {
        let title = basename(note.path)
        if (title && edited) {
            title = `${title} - Edited`
        } else if (!title) {
            title = "Untitled"
        }
        ipc.setTitle({ title })
    }, [note.path, edited])

    const openFile = useCallback(async (path?: string) => {
        const file = await ipc.openFile({ path })
        if (!file.canceled) {
            setNote({ content: file.content, deleted: false, path: file.path })
        }
    }, [])

    const onContentSave = useCallback((content: string) => {
        setEdited(false)
        setNote((note) => {
            return { ...note, content }
        })
    }, [])

    const onContentEdit = useCallback(() => {
        setEdited(true)
    }, [])

    const setNotePath = useCallback((path: string) => {
        if (path) setNote((note) => ({ ...note, path }))
    }, [])

    const saveFile = useCallback(
        async (note: Note) => {
            const { canceled, path } = await ipc.saveFile({ content: note.content, path: note.path })

            if (canceled) return

            setEdited(false)

            if (path && note.path !== path) {
                setNotePath(path)
            }
        },
        [setNotePath],
    )

    useEffect(() => {
        if (note.path) {
            saveFile(note)
        }
    }, [saveFile, note])

    return { note, openFile, setNotePath, onContentSave, onContentEdit }
}

const Workbench: FC = () => {
    const { note, openFile, setNotePath, onContentSave, onContentEdit } = useMarkdownNote()

    useEffect(() => {
        registerIpcHandlers(openFile, setNotePath)
    }, [setNotePath, openFile])

    return (
        <div>
            <Editor
                key={note.path}
                note={note}
                onContentSaveDelay={2000}
                onContentEdit={onContentEdit}
                onContentSave={onContentSave}
                drawerActivityContainer={drawerActivityContainer}
            />
        </div>
    )
}

export default Workbench
