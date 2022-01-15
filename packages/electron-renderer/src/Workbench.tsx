import React, { FC, useCallback, useMemo, useRef } from "react"

import { sleep } from "@rino.app/common"
import { Editor, EditorHandle, Mode, WysiwygOptions } from "@rino.app/editor"
import { IpcRendererListener } from "@rino.app/electron-types"

import { useBeforeUnload } from "./hooks/use-before-unload"
import { useIpcRendererListener } from "./hooks/use-ipc-renderer-listener"
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
        state: { content, path },
        handlers: { beforeUnload, closeWindow, setNotePath, setNoteContent, openFile, ensureFilePath, setIsSerializing },
    } = useWorkbench()

    useBeforeUnload(beforeUnload)

    const beforeExportToPdf = useCallback(async () => {
        editorRef.current?.switchMode(Mode.WYSIWYG)
        editorRef.current?.resetSelection()
        await sleep(0) // wait for the `resetSelection` to be applied
        ;(document.activeElement as HTMLElement | null)?.blur()
    }, [editorRef])

    const listener: IpcRendererListener = {
        openFile,
        ensureFilePath,
        setNotePath,
        beforeCloseWindow: closeWindow,
        beforeExportToPdf,
    }

    useIpcRendererListener(listener)

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
