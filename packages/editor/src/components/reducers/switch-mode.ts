import { EditorDelegate, EditorState, Mode } from "../types"

export type SwitchModeAction = {
    type: "SWITCH_MODE"
    payload: {
        wysiwygDelegate: EditorDelegate
        sourceCodeDelegate: EditorDelegate
    }
}

export function switchMode(state: EditorState, action: SwitchModeAction): EditorState {
    const currDelegate = state.delegate
    const currDoc = currDelegate.manager?.view?.state?.doc

    // The manager is not initialized yet, so we can't switch mode.
    if (!currDoc) {
        return state
    }

    const currContent: string = currDelegate.docToString(currDoc)

    const nextMode = state.mode === Mode.WYSIWYG ? Mode.SOURCE_CODE : Mode.WYSIWYG
    const nextDelegate = nextMode === Mode.WYSIWYG ? action.payload.wysiwygDelegate : action.payload.sourceCodeDelegate
    const nextDoc = nextDelegate.stringToDoc(currContent)

    return {
        ...state,
        initialDoc: nextDoc,
        mode: nextMode,
        delegate: nextDelegate,
    }
}
