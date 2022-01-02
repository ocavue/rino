import React, { FC, useMemo, useRef } from "react"

import { Editor, EditorHandle, WysiwygOptions } from "@rino.app/editor"

import { useBeforeUnload } from "./hooks/use-before-unload"
import { useIpcRendererHandlers } from "./hooks/use-ipc-renderer-handlers"
import { useWorkbench } from "./hooks/use-workbench"

const wysiwygOptions: WysiwygOptions = {
    isTesting: false,
    imageFileHandler: (props) => {
        return props.files.map((file) => {
            return {
                uri: file.path, // `file.path` only exists on Electron environment
                name: file.name,
            }
        })
    },
}

const Workbench: FC = () => {
    const editorRef = useRef<EditorHandle>(null)

    const {
        state: { content, path, canCloseWindow },
        handlers: { closeWindow, setNotePath, setNoteContent, openFile, ensureFilePath, setIsSerializing },
    } = useWorkbench()

    useBeforeUnload(canCloseWindow)

    useIpcRendererHandlers({
        setNotePath,
        openFile,
        ensureFilePath,
        closeWindow,
        editorRef,
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
                ref={editorRef}
                wysiwygOptions={wysiwygOptions}
                onContentSaveDelay={2000}
                onHasUnsavedChanges={setIsSerializing}
                onContentSave={setNoteContent}
            />
        </div>
    )
}

export default Workbench
