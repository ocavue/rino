import "./polyfill"

import { editContent, EditContentAction } from "./reducers/edit-content"
import { saveContent, SaveContentAction } from "./reducers/save-content"
import { switchMode, SwitchModeAction } from "./reducers/switch-mode"
import { EditorState, Mode, Note, WysiwygOptions } from "./types"
import { createWysiwygDelegate } from "./wysiwyg/wysiwyg-delegate"

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

export { editorReducer }

// const editorReducerWithLog = withLogReducer(editorReducer)

// export { editorReducerWithLog as editorReducer }

export function initializeState({ note, wysiwygOptions }: { note: Readonly<Note>; wysiwygOptions: WysiwygOptions }): EditorState {
    const wysiwygDelegate = createWysiwygDelegate(wysiwygOptions)

    return {
        mode: Mode.WYSIWYG,
        delegate: wysiwygDelegate,
        note: note,
        initialDoc: wysiwygDelegate.stringToDoc(note.content),
        hasUnsavedChanges: false,
        error: null,
    }
}
