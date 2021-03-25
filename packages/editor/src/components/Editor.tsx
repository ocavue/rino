/* Copyright (c) 2020-present ocavue@gmail.com */

import React, { useEffect, useRef, useState } from "react"

import { metaKey } from "@rino.app/common"

import { SourceCodeEditor } from "./source-code"
import { DrawerActivityContainer } from "./types"
import { WysiwygEditor } from "./wysiwyg"

interface Note {
    content: string
    deleted: boolean
}

type EditorProps = {
    autoFocus: boolean
    note: Note
    setNoteContent: (content: string) => void
    isDarkMode: boolean
    extraClassName: string
    maxDrawerWidth: number
    drawerActivityContainer: DrawerActivityContainer
    isTestEnv: boolean
}

const Editor: React.FC<EditorProps> = ({
    autoFocus,
    note,
    setNoteContent,
    isDarkMode,
    extraClassName,
    maxDrawerWidth,
    drawerActivityContainer,
    isTestEnv,
}) => {
    const [mode, setMode] = useState<"source-code" | "wysiwyg" | null>("wysiwyg")
    const initialContent = useRef<string>(note.content)

    useEffect(() => {
        const handleKeydown = (event: KeyboardEvent) => {
            if (event[metaKey] && event.code === "Slash") {
                // console.debug(`metaKey + / has been pressed`)
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

    const className = `${extraClassName} markdown-body ${isDarkMode ? "markdown-body--dark" : "markdown-body--light"}`

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
                maxDrawerWidth={maxDrawerWidth}
                drawerActivityContainer={drawerActivityContainer}
                isTestEnv={isTestEnv}
            />
        )
    else return null
}

export default Editor
