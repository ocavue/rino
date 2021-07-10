import React, { FC } from "react"

import { Editor } from "@rino.app/editor"

import { useMarkdownNote } from "./hooks/use-markdown-note"
import { useIpcSendHandelrs } from "./ipc"

const drawerActivityContainer = {
    useContainer: () => ({
        drawerActivity: false,
    }),
}

const Workbench: FC = () => {
    const { note, openFile, setNotePath, onContentSave, onContentEdit, ensureFilePath } = useMarkdownNote()

    useIpcSendHandelrs({
        setNotePath,
        openFile,
        ensureFilePath,
    })

    return (
        <div
            style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
            }}
        >
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
