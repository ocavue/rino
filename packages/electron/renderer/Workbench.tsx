import React, { FC, useState } from "react"

import { basename } from "@rino.app/common"
import { Editor } from "@rino.app/editor"

import { ipc } from "./ipc"

const drawerActivityContainer = {
    useContainer: () => ({
        drawerActivity: false,
    }),
}

const setNoteContent = (content: string) => {}

const Workbench: FC = () => {
    const [note, setNote] = useState({ content: "", deleted: false, path: "$[default]$" })

    const onClickOpenFile = async () => {
        const file = await ipc.openFile()
        if (file) {
            setNote({ content: file.content, deleted: false, path: file.path })
            await ipc.setTitle({ title: `${basename(file.path)}` }) // TODO: don't show multi-windows with a same title
        }
    }

    return (
        <div>
            <button onClick={ipc.newWindow}>New File</button>
            <button onClick={onClickOpenFile}>Open File</button>
            <button disabled>Save File</button>
            <button disabled>Revert</button>
            <button>Save HTML</button>
            <button disabled>Show File</button>
            <button disabled>Open in Default Application</button>
            <button
                onClick={async () => {
                    console.log(await ipc.getCurrentWindow())
                }}
            >
                Show current window
            </button>

            <Editor key={note.path} note={note} setNoteContent={setNoteContent} drawerActivityContainer={drawerActivityContainer} />
        </div>
    )
}

export default Workbench
