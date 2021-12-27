import { EditorState } from "../types"

export type EditContentAction = {
    type: "EDIT_CONTENT"
}

export function editContent(state: EditorState, action: EditContentAction): EditorState {
    return { ...state, hasUnsavedChanges: true }
}
