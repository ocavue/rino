import React, { FC, useMemo } from "react"

import { Editor } from "@rino.app/editor"

import { useBeforeUnloadV2 } from "./hooks/use-before-unload-v2"
import { useIpcRendererHandlers } from "./hooks/use-ipc-renderer-handlers"
import { useWorkbench } from "./hooks/use-workbench"

const WorkbenchV2: FC = () => {
    const {
        state: { content, path },
        handlers: { closeWindow, setNotePath, setNoteContent, openFile, ensureFilePath, setIsSerializing },
    } = useWorkbench()

    useBeforeUnloadV2(closeWindow)

    useIpcRendererHandlers({
        setNotePath,
        openFile,
        ensureFilePath,
        beforeCloseWindow: closeWindow,
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
            <Editor
                key={path}
                note={note}
                onContentSaveDelay={2000}
                onHasUnsavedChanges={setIsSerializing}
                onContentSave={setNoteContent}
            />
        </div>
    )
}

export default WorkbenchV2
