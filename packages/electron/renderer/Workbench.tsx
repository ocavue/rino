import React, { FC, useState } from "react"

import { Editor } from "@rino.app/editor"

import { getApi } from "./ipc-renderer"

const drawerActivityContainer = {
    useContainer: () => ({
        drawerActivity: false,
    }),
}

const setNoteContent = (content: string) => {}

const Workbench: FC = () => {
    const [note, setNote] = useState({ content: "# hello", deleted: false, path: "$[default]$" })

    const onClickOpenFile = async () => {
        const file = await getApi().openFile()
        console.log("file:", file)
        if (file) {
            setNote({ content: file.content, deleted: false, path: file.path })
        }
    }

    return (
        <div>
            <button>New File</button>
            <button onClick={onClickOpenFile}>Open File</button>
            <button disabled>Save File</button>
            <button disabled>Revert</button>
            <button>Save HTML</button>
            <button disabled>Show File</button>
            <button disabled>Open in Default Application</button>

            <Editor key={note.path} note={note} setNoteContent={setNoteContent} drawerActivityContainer={drawerActivityContainer} />
        </div>
    )
}

export default Workbench
