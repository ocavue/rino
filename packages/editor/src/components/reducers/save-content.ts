import { EditorState } from "../types"

export type SaveContentAction = {
    type: "SAVE_CONTENT"
}

export function saveContent(state: EditorState): EditorState {
    const currDelegate = state.delegate
    const currDoc = currDelegate.manager?.view?.state?.doc

    // The manager is not initialized yet, so we can't switch mode.
    if (!currDoc) {
        return state
    }

    const currContent: string = currDelegate.docToString(currDoc)
    return { ...state, note: { content: currContent, deleted: state.note.deleted }, hasUnsavedChanges: false }
}
