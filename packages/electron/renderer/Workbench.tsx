import React, { FC, useCallback, useEffect, useState } from "react"

import { basename } from "@rino.app/common"
import { Editor } from "@rino.app/editor"

import { ipc } from "./ipc"

const drawerActivityContainer = {
    useContainer: () => ({
        drawerActivity: false,
    }),
}

function useMarkdownNote() {
    const [note, setNote] = useState<{ content: string; path: string; deleted: boolean }>({ content: "", path: "", deleted: false })

    useEffect(() => {
        // TODO: don't show multi-windows with a same title
        ipc.setTitle({ title: `${basename(note.path)}` })
    }, [note.path])

    const openFile = useCallback(async () => {
        const file = await ipc.openFile()
        if (!file.canceled) {
            setNote({ content: file.content, deleted: false, path: file.path })
        }
    }, [])

    const saveFile = useCallback(async () => {
        const { canceled, path } = await ipc.saveFile({ content: note.content, path: note.path })
        if (!canceled && path && note.path !== path) {
            setNote((note) => ({ ...note, path }))
        }
    }, [note])

    const setNoteContent = useCallback((content: string) => {
        setNote((note) => ({ ...note, content }))
    }, [])

    return { note, openFile, saveFile, setNoteContent }
}

const Workbench: FC = () => {
    const { note, openFile, saveFile, setNoteContent } = useMarkdownNote()

    return (
        <div>
            <button onClick={() => ipc.newWindow()}>New File</button>
            <button onClick={openFile}>Open File</button>
            <button onClick={saveFile}>Save File</button>

            <Editor key={note.path} note={note} setNoteContent={setNoteContent} drawerActivityContainer={drawerActivityContainer} />
        </div>
    )
}

export default Workbench
