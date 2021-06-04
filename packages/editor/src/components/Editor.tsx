import React, { useCallback, useEffect, useRef, useState } from "react"

import { metaKey } from "@rino.app/common"

import { SourceCodeEditor } from "./source-code"
import { EDITOR_THEME_GITHUB } from "./theme/github"
import { DrawerActivityContainer } from "./types"
import { WysiwygEditor } from "./wysiwyg"

export interface Note {
    content: string
    deleted: boolean
}

export type EditorProps = {
    autoFocus: boolean
    note: Note
    setNoteContent: (content: string) => void
    isDarkMode: boolean
    extraClassName: string
    maxDrawerWidth: number
    drawerActivityContainer: DrawerActivityContainer
    isTestEnv: boolean
}

export const useTimmer = (): number => {
    const [time, setTime] = useState(1)
    useEffect(() => {
        const timout = setInterval(() => setTime((i) => i + 1), 100)
        return () => clearInterval(timout)
    }, [setTime])
    return time
}

const enum Mode {
    WYSIWYG = 1,
    SOURCE_CODE = 2,
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
    const [mode, setMode] = useState<Mode>(Mode.WYSIWYG)
    const [isSwitchingMode, setIsSwitchingMode] = useState<boolean>(false)
    const [initialContent, setInitialContent] = useState<string>(note.content)
    const contentRef = useRef(note.content)

    const onContentChange = useCallback(
        (content: string) => {
            contentRef.current = content
            setNoteContent(content)
        },
        [setNoteContent],
    )

    const beforeUnmount = useCallback(() => {
        setInitialContent(contentRef.current)
        setMode(mode === Mode.WYSIWYG ? Mode.SOURCE_CODE : Mode.WYSIWYG)
        setIsSwitchingMode(false)
    }, [mode])

    useEffect(() => {
        const handleKeydown = (event: KeyboardEvent) => {
            if (event[metaKey] && event.code === "Slash") {
                setIsSwitchingMode(true)
            }
        }
        window.addEventListener("keydown", handleKeydown)
        return () => window.removeEventListener("keydown", handleKeydown)
    }, [mode, note])

    const className =
        `${extraClassName} ${EDITOR_THEME_GITHUB} markdown-body ` + (isDarkMode ? "markdown-body--dark" : "markdown-body--light")

    if (isSwitchingMode) {
        return null
    } else if (mode === Mode.WYSIWYG) {
        return (
            <WysiwygEditor
                className={className}
                autoFocus={autoFocus}
                editable={!note.deleted}
                initialContent={initialContent}
                onContentChange={onContentChange}
                beforeUnmount={beforeUnmount}
                maxDrawerWidth={maxDrawerWidth}
                drawerActivityContainer={drawerActivityContainer}
                isTestEnv={isTestEnv}
            />
        )
    } else {
        return (
            <SourceCodeEditor
                className={className}
                autoFocus={autoFocus}
                editable={!note.deleted}
                initialContent={initialContent}
                onContentChange={onContentChange}
                beforeUnmount={beforeUnmount}
            />
        )
    }
}

export default Editor
