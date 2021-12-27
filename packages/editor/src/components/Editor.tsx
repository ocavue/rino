import "./polyfill"

import { cx } from "@emotion/css"
import { ProsemirrorNode } from "@remirror/pm/suggest"
import { isString } from "lodash-es"
import React, { useCallback, useEffect, useReducer, useState } from "react"

import { metaKey } from "@rino.app/common"

import { SourceCodeEditor } from "./source-code"
import { useSourceCodeEditor } from "./source-code/use-source-code-editor"
import { EDITOR_THEME_GITHUB } from "./theme/github"
import { DrawerActivityContainer, EditorDelegate } from "./types"
import { WysiwygEditor } from "./wysiwyg"
import { useWysiwygEditor } from "./wysiwyg/use-wysiwyg-editor"

export interface Note {
    content: string
    deleted: boolean
}

export type EditorProps = {
    note: Readonly<Note>
    drawerActivityContainer: DrawerActivityContainer
    enableDevTools?: boolean
    autoFocus?: boolean
    isDarkMode?: boolean
    extraClassName?: string
    maxDrawerWidth?: number
    isTestEnv?: boolean
    onContentSaveDelay?: number
    onContentSave?: (content: string) => void
    onContentEdit?: () => void
}

enum Mode {
    WYSIWYG = 1,
    SOURCE_CODE = 2,
}

type EditorState = {
    mode: Mode
    initialDoc: ProsemirrorNode
    className: string
}

function initializeState({ wysiwygDelegate, note }: { wysiwygDelegate: EditorDelegate; note: Readonly<Note> }): EditorState {
    return {
        mode: Mode.WYSIWYG,
        initialDoc: wysiwygDelegate.stringToDoc(note.content),
        className: "",
    }
}

function editorReducer(state: EditorState, action: any /*TODO*/): EditorState {
    switch (action.type) {
        case "set-mode":
            return {
                ...state,
                mode: action.mode,
            }
        case "set-initial-doc":
            return {
                ...state,
                initialDoc: action.initialDoc,
            }
        case "set-class-name":
            return {
                ...state,
                className: action.className,
            }
        default:
            return state
    }
}

export function useEditor({
    note,
    drawerActivityContainer,
    enableDevTools = true,
    autoFocus = true,
    isDarkMode = false,
    extraClassName = "",
    maxDrawerWidth = 0,
    isTestEnv = false,
    onContentSaveDelay = 500,
    onContentSave = (content: string) => {},
    onContentEdit = () => {},
}: EditorProps) {
    const wysiwygDelegate = useWysiwygEditor({ isTestEnv })
    const sourceCodeDelegate = useSourceCodeEditor()
    const [state, dispatch] = useReducer(editorReducer, { wysiwygDelegate, note }, initializeState)
    const delegate: EditorDelegate = state.mode === Mode.WYSIWYG ? wysiwygDelegate : sourceCodeDelegate

    const beforeUnmount = useCallback((content?: string) => {
        if (isString(content)) {
            setInitialContent(content)
        }
        setMode((mode) => (mode === Mode.WYSIWYG ? Mode.SOURCE_CODE : Mode.WYSIWYG))
        setIsSwitchingMode(false)
    }, [])
}

const Editor: React.FC<EditorProps> = ({
    note,
    drawerActivityContainer,
    enableDevTools = true,
    autoFocus = true,
    isDarkMode = false,
    extraClassName = "",
    maxDrawerWidth = 0,
    isTestEnv = false,
    onContentSaveDelay = 500,
    onContentSave = (content: string) => {},
    onContentEdit = () => {},
}) => {
    const [mode, setMode] = useState<Mode>(Mode.WYSIWYG)
    const [isSwitchingMode, setIsSwitchingMode] = useState<boolean>(false)
    const [initialContent, setInitialContent] = useState<string>(note.content)

    const beforeUnmount = useCallback((content?: string) => {
        if (isString(content)) {
            setInitialContent(content)
        }
        setMode((mode) => (mode === Mode.WYSIWYG ? Mode.SOURCE_CODE : Mode.WYSIWYG))
        setIsSwitchingMode(false)
    }, [])

    useEffect(() => {
        const handleKeydown = (event: KeyboardEvent) => {
            if (event[metaKey] && event.code === "Slash") {
                setIsSwitchingMode(true)
            }
        }
        window.addEventListener("keydown", handleKeydown)
        return () => window.removeEventListener("keydown", handleKeydown)
    }, [mode, note])

    const className = cx(extraClassName, EDITOR_THEME_GITHUB, "markdown-body", isDarkMode ? "markdown-body--dark" : "markdown-body--light")

    if (error) {
        // I didn't use React `componentDidCatch` method because I can't turn off `react-error-overlay` (easily) and
        // it will show an error overlay window in development mode when `componentDidCatch` been called.
        console.error(error)
        return (
            <div data-testid="wysiwyg_mode_error">
                <h1>
                    <br />
                    Something went wrong.
                </h1>
                <p>{`${error}`}</p>
            </div>
        )
    }

    if (isSwitchingMode) {
        return null
    } else if (mode === Mode.WYSIWYG) {
        return (
            <WysiwygEditor
                className={className}
                autoFocus={autoFocus}
                editable={!note.deleted}
                initialContent={initialContent}
                onContentSaveDelay={onContentSaveDelay}
                beforeUnmount={beforeUnmount}
                onContentEdit={onContentEdit}
                onContentSave={onContentSave}
                enableDevTools={enableDevTools}
                //
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
                onContentSaveDelay={onContentSaveDelay}
                beforeUnmount={beforeUnmount}
                onContentEdit={onContentEdit}
                onContentSave={onContentSave}
                enableDevTools={enableDevTools}
            />
        )
    }
}

export default Editor
