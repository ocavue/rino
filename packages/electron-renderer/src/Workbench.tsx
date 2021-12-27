import React, { FC, useMemo } from "react"

import { Editor } from "@rino.app/editor"

import { useBeforeUnload } from "./hooks/use-before-unload"
import { useIpcRendererHandlers } from "./hooks/use-ipc-renderer-handlers"
import { useMarkdownNote } from "./hooks/use-markdown-note"

const Workbench: FC = () => {
    const { content, path, openFile, setNotePath, onContentSave, setIsSerializing, ensureFilePath, beforeCloseWindow, canUnmountNow } =
        useMarkdownNote()

    useBeforeUnload(content, path, canUnmountNow, ensureFilePath)

    useIpcRendererHandlers({
        setNotePath,
        openFile,
        ensureFilePath,
        beforeCloseWindow,
    })

    const note = useMemo(() => {
        return {
            content,
            deleted: false,
        }
    }, [content])

    return (
        <div
            style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Editor key={path} note={note} onContentSaveDelay={2000} onHasUnsavedChanges={setIsSerializing} onContentSave={onContentSave} />
        </div>
    )
}

export default Workbench
