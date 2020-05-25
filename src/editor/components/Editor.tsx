import { createStyles, makeStyles, Theme } from "@material-ui/core"
import { useTheme } from "@material-ui/core/styles"
import clsx from "clsx"
import React, { useEffect, useRef, useState } from "react"

import { maxEditorWidth } from "src/constants"
import { SourceCodeEditor, WysiwygEditor } from "src/editor"
import { OuterEditorProps } from "src/editor/components/types"
import { metaKey } from "src/utils"

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        editor: {
            height: "100%",
            width: "100%",
            maxWidth: maxEditorWidth,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "stretch",
            "& .ProseMirror": {
                paddingTop: "40px !important",
                flex: "1 !important",
                border: "none",
                outline: "none",
                boxShadow: "none",
            },
        },
    })
})

export const Editor: React.FC<OuterEditorProps> = ({ autoFocus, note, setNoteContent }) => {
    const classes = useStyles()
    const [mode, setMode] = useState<"source-code" | "wysiwyg" | null>("wysiwyg")
    const initialContent = useRef<string>(note.content)

    useEffect(() => {
        const handleKeydown = (event: KeyboardEvent) => {
            if (event[metaKey] && event.code === "Slash") {
                console.debug(`metaKey + / has been pressed`)
                const nextMode = mode === "wysiwyg" ? "source-code" : "wysiwyg"
                // Unmount SourceCodeEditor / WysiwygEditor first, so that it's `componentWillUnmount` will be called.
                setMode(null)
                setTimeout(() => {
                    initialContent.current = note.content
                    setMode(nextMode)
                }, 0)
            }
        }
        window.addEventListener("keydown", handleKeydown)
        return () => window.removeEventListener("keydown", handleKeydown)
    }, [mode, note])

    useEffect(() => {
        console.debug(`Mounting <${Editor.displayName}/>`)
        return () => console.debug(`Unmounting <${Editor.displayName}/>`)
    }, [])

    const theme = useTheme()
    const className = clsx(
        classes.editor,
        "markdown-body",
        theme.palette.type === "light" ? "markdown-body--light" : "markdown-body--dark",
    )

    if (mode === "source-code")
        return (
            <SourceCodeEditor
                className={className}
                autoFocus={autoFocus}
                editable={!note.deleted}
                content={initialContent.current}
                setContent={setNoteContent}
            />
        )
    else if (mode === "wysiwyg")
        return (
            <WysiwygEditor
                className={className}
                autoFocus={autoFocus}
                editable={!note.deleted}
                content={initialContent.current}
                setContent={setNoteContent}
            />
        )
    else return null
}

Editor.displayName = "Editor"

export default Editor
