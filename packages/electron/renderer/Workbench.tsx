import React, { FC, useCallback, useEffect, useState } from "react"

import { basename } from "@rino.app/common"
import { Editor } from "@rino.app/editor"

import { ipc } from "./ipc"

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

    const openFile = useCallback(async () => {
        const file = await ipc.openFile()
        if (!file.canceled) {
            setNote({ content: file.content, deleted: false, path: file.path })
        }
    }, [])

    const onContentSave = useCallback((content: string) => {
        console.log("onContentSave1")

        setEdited(false)
        setNote((note) => {
            return { ...note, content }
        })
    }, [])

    const onContentEdit = useCallback(() => {
        setEdited(true)
    }, [])

    const saveFile = useCallback(async (note: Note) => {
        console.log("savefile 0")
        const { canceled, path } = await ipc.saveFile({ content: note.content, path: note.path })
        console.log("savefile 1", canceled, path)

        if (canceled) return

        setEdited(false)

        if (path && note.path !== path) {
            setNote((note) => ({ ...note, path }))
        }
    }, [])

    useEffect(() => {
        if (note.path) {
            saveFile(note)
        }
    }, [saveFile, note])

    return { note, openFile, saveFile, onContentSave, onContentEdit }
}

const Workbench: FC = () => {
    const { note, openFile, saveFile, onContentSave, onContentEdit } = useMarkdownNote()

    return (
        <div>
            <button onClick={() => ipc.newWindow()}>New File</button>
            <button onClick={() => openFile()}>Open File</button>
            <button onClick={() => saveFile(note)}>Save File</button>

            <Editor
                key={note.path}
                note={note}
                onContentSaveDelay={5000}
                onContentEdit={onContentEdit}
                onContentSave={onContentSave}
                drawerActivityContainer={drawerActivityContainer}
            />
        </div>
    )
}

export default Workbench
