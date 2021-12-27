import { EditorState } from "../types"

export type SaveContentAction = {
    type: "SAVE_CONTENT"
    payload: {
        onContentSave: (content: string) => void
    }
}

export function saveContent(state: EditorState, action: SaveContentAction): EditorState {
    const currDelegate = state.delegate
    const currDoc = currDelegate.manager?.view?.state?.doc

    // The manager is not initialized yet, so we can't switch mode.
    if (!currDoc) {
        return state
    }

    const currContent: string = currDelegate.docToString(currDoc)
    action.payload.onContentSave(currContent)
    return state
}
