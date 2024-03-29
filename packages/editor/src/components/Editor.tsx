import "./polyfill"

import { cx } from "@emotion/css"
import { environment, Extension, RemirrorEventListenerProps, RemirrorManager } from "@remirror/core"
import { TextSelection } from "@remirror/pm/state"
import { RemirrorProps } from "@remirror/react-core"
import { debounce } from "lodash-es"
import React, { useCallback, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useReducer } from "react"

import { ToggleableInlineMarkName } from "../extensions"
import { editorReducer, initializeState } from "./editor-state"
import { SourceCodeEditor } from "./source-code"
import { EDITOR_THEME_GITHUB } from "./theme/github"
import { Mode, Note, WysiwygOptions } from "./types"
import { WysiwygEditor, WysiwygExtension } from "./wysiwyg"

/** @public */
export type EditorProps = {
    note: Readonly<Note>
    enableDevTools?: boolean
    autoFocus?: boolean
    isDarkMode?: boolean
    extraClassName?: string
    wysiwygOptions?: WysiwygOptions
    onContentSaveDelay?: number
    onContentSave?: (content: string) => void
    onHasUnsavedChanges?: (hasUnsavedChanges: boolean) => void
}

/** @public */
export type EditorHandle = {
    switchMode: (mode?: Mode) => void

    // Set the selection at the beginning of the editor. By doing this, we can
    // make sure any popups (e.g. language menu for code blocks) are hidden.
    resetSelection: () => void

    toggleInlineMark: (mark: ToggleableInlineMarkName) => void
}

const defaultWysiwygOptions: WysiwygOptions = {}

const Editor: React.ForwardRefRenderFunction<EditorHandle, EditorProps> = (
    {
        note,
        enableDevTools = false,
        autoFocus = true,
        isDarkMode = false,
        extraClassName = "",
        wysiwygOptions = defaultWysiwygOptions,
        onContentSaveDelay = 500,
        onContentSave,
        onHasUnsavedChanges,
    },
    forwardedRef,
) => {
    const [state, dispatch] = useReducer(editorReducer, { note, wysiwygOptions }, initializeState)

    const manager = state.delegate.manager

    const saveContent = useCallback(() => {
        dispatch({ type: "SAVE_CONTENT" })
    }, [])

    const switchMode = useCallback(
        (mode?: Mode) => {
            dispatch({ type: "SWITCH_MODE", payload: { wysiwygOptions, mode } })
        },
        [wysiwygOptions],
    )

    const editContent = useCallback(() => {
        dispatch({ type: "EDIT_CONTENT" })
    }, [])

    // Register onChange handler
    const onChange = useMemo(() => {
        const saveContent = () => dispatch({ type: "SAVE_CONTENT" })
        const saveContentWithDelay = debounce(saveContent, onContentSaveDelay)
        return (params: RemirrorEventListenerProps<Extension>) => {
            const { tr, firstRender } = params

            if (!firstRender && tr?.docChanged && !tr.getMeta("RINO_APPLY_MARKS")) {
                editContent()
                saveContentWithDelay()
            }
        }
    }, [editContent, onContentSaveDelay])

    // Register switch mode shortcut
    useEffect(() => {
        const metaKey = environment.isApple ? "metaKey" : "ctrlKey"
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

    // Register view for debug
    useEffect(() => {
        if (typeof window !== "undefined") {
            // Let e2e test to inject the editor view
            ;(window as any)._RINO_EDITOR_VIEW = manager.view
        }
    }, [manager])

    // Notice that we only watch `manager` and never watch `manager.view`. That's because `manager.view` is not yet exist when the component
    // is mounted, and when `manager.view` does exist, this component not re-render.
    useImperativeHandle(
        forwardedRef,
        () => {
            const view = manager.view
            return {
                switchMode: switchMode,
                resetSelection: () => {
                    if (!view) {
                        console.warn("failed to find view")
                        return
                    }
                    view.dispatch(view.state.tr.setSelection(TextSelection.near(view.state.doc.resolve(1))))
                },
                toggleInlineMark: (mark: ToggleableInlineMarkName) => {
                    const m: RemirrorManager<WysiwygExtension> = manager
                    m.store.commands.toggleInlineMark?.(mark)
                },
            }
        },
        [switchMode, manager],
    )

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

    const remirrorProps: RemirrorProps = {
        manager: state.delegate.manager,
        autoFocus: autoFocus,
        initialContent: state.initialDoc,
        onChange: onChange,
        editable: !state.note.deleted,
    }

    const className = cx(extraClassName, EDITOR_THEME_GITHUB, "markdown-body", isDarkMode ? "markdown-body--dark" : "markdown-body--light")

    if (state.mode === Mode.WYSIWYG) {
        return <WysiwygEditor remirrorProps={remirrorProps} innerEditorProps={{ className, enableDevTools }} />
    } else {
        return <SourceCodeEditor remirrorProps={remirrorProps} innerEditorProps={{ className }} />
    }
}

/** @public */
const ForwardRefEditor = React.forwardRef(Editor)
ForwardRefEditor.displayName = "Editor"

export default ForwardRefEditor
