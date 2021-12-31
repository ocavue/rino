import { createSourceCodeDelegate } from "../source-code/source-code-delegate"
import { EditorState, Mode } from "../types"
import { createWysiwygDelegate } from "../wysiwyg/wysiwyg-delegate"

export type SwitchModeAction = {
    type: "SWITCH_MODE"
    payload: {
        isTestEnv: boolean

        // If `mode` is provided, the editor will be forced to switch to that mode.
        mode?: Mode
    }
}

export function switchMode(state: EditorState, action: SwitchModeAction): EditorState {
    if (action.payload.mode === state.mode) {
        return state
    }

    const currDelegate = state.delegate
    const currDoc = currDelegate.manager?.view?.state?.doc

    const currContent: string = currDoc ? currDelegate.docToString(currDoc) : state.note.content
    setTimeout(() => currDelegate.manager.destroy(), 0)

    const nextMode = state.mode === Mode.WYSIWYG ? Mode.SOURCE_CODE : Mode.WYSIWYG
    const nextDelegate =
        nextMode === Mode.WYSIWYG ? createWysiwygDelegate({ isTestEnv: action.payload.isTestEnv }) : createSourceCodeDelegate()

    try {
        const nextDoc = nextDelegate.stringToDoc(currContent)
        return {
            ...state,
            initialDoc: nextDoc,
            mode: nextMode,
            delegate: nextDelegate,
            error: null,
        }
    } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        return {
            ...state,
            initialDoc: null,
            mode: nextMode,
            delegate: nextDelegate,
            error,
        }
    }
}
