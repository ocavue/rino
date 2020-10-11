import { createStyles, makeStyles, Theme } from "@material-ui/core"
import { useTheme } from "@material-ui/core/styles"
import clsx from "clsx"
import React, { useEffect, useMemo, useRef, useState } from "react"

import { MAX_EDITOR_WIDTH } from "src/constants"
import { WysiwygEditor } from "src/editor/components//wysiwyg/WysiwygEditor"
import { SourceCodeEditor } from "src/editor/components/source-code/SourceCodeEditor"
import { metaKey } from "src/utils"

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        editor: {
            height: "100%",
            width: "100%",
            maxWidth: MAX_EDITOR_WIDTH,
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

const CombinedEditor: React.FC<{
    editable: boolean
    autoFocus: boolean
    content: string
    setContent: (content: string) => void
}> = ({ editable, autoFocus, content, setContent }) => {
    useEffect(() => {
        console.debug(`Mounting <${CombinedEditor.displayName}/>`)
        return () => console.debug(`Unmounting <${CombinedEditor.displayName}/>`)
    }, [])

    const theme = useTheme()
    const classes = useStyles()
    const [mode, setMode] = useState<"source-code" | "wysiwyg" | null>("wysiwyg")
    const initialContent = useRef<string>(content)

    useEffect(() => {
        const handleKeydown = (event: KeyboardEvent) => {
            if (event[metaKey] && event.code === "Slash") {
                console.debug(`metaKey + / has been pressed`)
                const nextMode = mode === "wysiwyg" ? "source-code" : "wysiwyg"
                // Unmount SourceCodeEditor / WysiwygEditor first, so that its `componentWillUnmount` will be called.
                setMode(null)
                setTimeout(() => {
                    initialContent.current = content
                    setMode(nextMode)
                }, 0)
            }
        }
        window.addEventListener("keydown", handleKeydown)
        return () => window.removeEventListener("keydown", handleKeydown)
    }, [mode, content])

    const className = useMemo(() => {
        return clsx(
            classes.editor,
            "markdown-body",
            theme.palette.type === "light" ? "markdown-body--light" : "markdown-body--dark",
        )
    }, [classes, theme])

    if (mode === "source-code")
        return (
            <SourceCodeEditor
                className={className}
                autoFocus={autoFocus}
                editable={editable}
                content={initialContent.current}
                setContent={setContent}
            />
        )
    else if (mode === "wysiwyg")
        return (
            <WysiwygEditor
                className={className}
                autoFocus={autoFocus}
                editable={editable}
                content={initialContent.current}
                setContent={setContent}
            />
        )
    else return null
}

CombinedEditor.displayName = "CombinedEditor"

export { CombinedEditor }
