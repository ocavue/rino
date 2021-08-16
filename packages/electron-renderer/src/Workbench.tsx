import React, { FC } from "react"

import { Editor } from "@rino.app/editor"

import { useBeforeUnload } from "./hooks/use-before-unload"
import { useIpcRendererHandlers } from "./hooks/use-ipc-renderer-handlers"
import { useMarkdownNote } from "./hooks/use-markdown-note"

const drawerActivityContainer = {
    useContainer: () => ({
        drawerActivity: false,
    }),
}

const Workbench: FC = () => {
    const { note, openFile, setNotePath, onContentSave, onContentEdit, ensureFilePath, beforeCloseWindow, closing } = useMarkdownNote()

    useBeforeUnload(note, closing, ensureFilePath)

    useIpcRendererHandlers({
        setNotePath,
        openFile,
        ensureFilePath,
        beforeCloseWindow,
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
