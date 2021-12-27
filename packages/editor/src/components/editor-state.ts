import "./polyfill"

import { withLogReducer } from "./reducer-logger"
import { editContent, EditContentAction } from "./reducers/edit-content"
import { saveContent, SaveContentAction } from "./reducers/save-content"
import { switchMode, SwitchModeAction } from "./reducers/switch-mode"
import { EditorDelegate, EditorState, Mode, Note } from "./types"

type EditorAction = SwitchModeAction | SaveContentAction | EditContentAction

function throwUnknownActionError(action: never): never {
    throw new Error(`Unknown action type ${action}`)
}

function editorReducer(state: EditorState, action: EditorAction): EditorState {
    switch (action.type) {
        case "SWITCH_MODE":
            return switchMode(state, action)
        case "SAVE_CONTENT":
            return saveContent(state)
        case "EDIT_CONTENT":
            return editContent(state, action)
        default:
            throwUnknownActionError(action)
    }
}

// export { editorReducer }

const editorReducerWithLog = withLogReducer(editorReducer)

export { editorReducerWithLog as editorReducer }

export function initializeState({ wysiwygDelegate, note }: { wysiwygDelegate: EditorDelegate; note: Readonly<Note> }): EditorState {
    return {
        mode: Mode.WYSIWYG,
        delegate: wysiwygDelegate,
        note: note,
        initialDoc: wysiwygDelegate.stringToDoc(note.content),
        hasUnsavedChanges: false,
        error: null,
    }
}
