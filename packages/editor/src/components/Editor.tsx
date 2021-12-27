import "./polyfill"

import { cx } from "@emotion/css"
import { Extension, RemirrorEventListenerProps } from "@remirror/core"
import { RemirrorProps } from "@remirror/react-core"
import { debounce } from "lodash-es"
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useReducer } from "react"

import { metaKey } from "@rino.app/common"

import { editorReducer, initializeState } from "./editor-state"
import { SourceCodeEditor } from "./source-code"
import { useSourceCodeEditor } from "./source-code/use-source-code-editor"
import { EDITOR_THEME_GITHUB } from "./theme/github"
import { EditorDelegate, Mode, Note } from "./types"
import { WysiwygEditor } from "./wysiwyg"
import { useWysiwygEditor } from "./wysiwyg/use-wysiwyg-editor"

export type EditorProps = {
    note: Readonly<Note>
    enableDevTools?: boolean
    autoFocus?: boolean
    isDarkMode?: boolean
    extraClassName?: string
    isTestEnv?: boolean
    onContentSaveDelay?: number
    onContentSave?: (content: string) => void
    onHasUnsavedChanges?: (hasUnsavedChanges: boolean) => void
}

const Editor: React.FC<EditorProps> = ({
    note,
    enableDevTools = true,
    autoFocus = true,
    isDarkMode = false,
    extraClassName = "",
    isTestEnv = false,
    onContentSaveDelay = 500,
    onContentSave,
    onHasUnsavedChanges,
}) => {
    const wysiwygDelegate: EditorDelegate = useWysiwygEditor({ isTestEnv })
    const sourceCodeDelegate: EditorDelegate = useSourceCodeEditor()
    const [state, dispatch] = useReducer(editorReducer, { wysiwygDelegate, note }, initializeState)

    const saveContent = useCallback(() => {
        dispatch({ type: "SAVE_CONTENT" })
    }, [])

    const switchMode = useCallback(() => {
        dispatch({ type: "SWITCH_MODE", payload: { wysiwygDelegate, sourceCodeDelegate } })
    }, [sourceCodeDelegate, wysiwygDelegate])

    const editContent = useCallback(() => {
        dispatch({ type: "EDIT_CONTENT" })
    }, [])

    // Register onChange handler
    const onChange = useMemo(() => {
        const saveContent = () => dispatch({ type: "SAVE_CONTENT" })
        const saveContentWithDelay = debounce(saveContent, onContentSaveDelay)
        return (props: RemirrorEventListenerProps<Extension>) => {
            // const { tr } = props
            // if (tr && tr.docChanged) {
            //     const prev = props.previousState.doc.toJSON()
            //     const curr = props.state.doc.toJSON()
            //     console.log("prev === curr:", prev === curr)
            //     console.log("EDIT_CONTENT diff:", diffObject(curr, prev))
            // }

            if (!props.firstRender && props.tr?.docChanged) {
                editContent()
                saveContentWithDelay()
            }
        }
    }, [editContent, onContentSaveDelay])

    // Register switch mode shortcut
    useEffect(() => {
        const handleKeydown = (event: KeyboardEvent) => {
            if (event[metaKey] && event.code === "Slash") {
                saveContent()
                switchMode()
            }
        }
        window.addEventListener("keydown", handleKeydown)
        return () => window.removeEventListener("keydown", handleKeydown)
    }, [saveContent, switchMode])

    // Save content when content changes
    useLayoutEffect(() => {
        onContentSave?.(state.note.content)
    }, [onContentSave, state.note.content])

    // Register onHasUnsavedChanges handler
    useEffect(() => {
        onHasUnsavedChanges?.(state.hasUnsavedChanges)
    }, [onHasUnsavedChanges, state.hasUnsavedChanges])

    const remirrorProps: RemirrorProps = {
        manager: state.delegate.manager,
        autoFocus: autoFocus,
        initialContent: state.initialDoc,
        onChange: onChange,
        editable: !state.note.deleted,
    }

    const className = cx(extraClassName, EDITOR_THEME_GITHUB, "markdown-body", isDarkMode ? "markdown-body--dark" : "markdown-body--light")

    if (state.error) {
        // I didn't use React `componentDidCatch` method because I can't turn off `react-error-overlay` (easily) and
        // it will show an error overlay window in development mode when `componentDidCatch` been called.
        console.error(state.error)
        return (
            <div data-testid={state.mode === Mode.WYSIWYG ? "wysiwyg_mode_error" : "source_code_mode_error"}>
                <h1>
                    <br />
                    Something went wrong.
                </h1>
                <p>{`${state.error}`}</p>
            </div>
        )
    }

    if (state.mode === Mode.WYSIWYG) {
        return <WysiwygEditor remirrorProps={remirrorProps} innerEditorProps={{ className, enableDevTools }} />
    } else {
        return <SourceCodeEditor remirrorProps={remirrorProps} innerEditorProps={{ className }} />
    }
    return <div>xx</div>
}

export default Editor
