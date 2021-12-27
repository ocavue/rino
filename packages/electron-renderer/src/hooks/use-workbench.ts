import produce from "immer"
import { Dispatch, useCallback, useReducer } from "react"

import { ipcInvoker } from "../ipc-renderer"
import { calcCanCloseWindow } from "./calc-can-close-window"
import { useTitleEffect } from "./use-title-effect"

export type WorkbenchState = {
    content: string
    path: string

    // is wait for the editor to serialize the content
    isSerializing: boolean

    // is wait for the main process to save the file
    isSaving: boolean

    actionQueue: WorkbenchAction[]

    currentAction: WorkbenchAction | null

    currentActionStartTime: number

    contentDiscarded: boolean
}

const initialState = Object.freeze<WorkbenchState>({
    content: "",
    path: "",

    isSerializing: false,
    isSaving: false,

    actionQueue: [],

    currentAction: null,

    currentActionStartTime: 0,

    contentDiscarded: false,
})

type DiscardContentAction = {
    type: "DISCARD_CONTENT"
}

type CloseWindowAction = {
    type: "CLOSE_WINDOW"
    dispatch: Dispatch<WorkbenchAction>
}

async function closeWindow(state: WorkbenchState, action: CloseWindowAction): Promise<void> {
    if (calcCanCloseWindow(state)) {
        // close the window
        ipcInvoker.closeWindow()
    } else {
        startAsyncAction(state, action)

        const dispatch = action.dispatch
        if (!state.path) {
            const { filePath, canceled, discarded } = await ipcInvoker.askMarkdownFileForClose()

            dispatch({ type: "CLEAN_CURRENT_ACTION", payload: { action: action } })
            if (discarded) {
                dispatch({ type: "DISCARD_CONTENT" })
                dispatch({ type: "CLOSE_WINDOW", dispatch })
            } else if (filePath && !canceled) {
                dispatch({ type: "SET_NOTE_PATH", payload: { path: filePath } })
                dispatch({ type: "CLOSE_WINDOW", dispatch })
            }
        }
    }
}

type SaveFileAction = {
    type: "OPEN_FILE"
    payload: {
        path: string
        content: string
    }
}

type SetNotePathAction = {
    type: "SET_NOTE_PATH"
    payload: {
        path: string
    }
}

type SetNoteContentAction = {
    type: "SET_NOTE_CONTENT"
    payload: {
        content: string
    }
}

type EnsureFilePathAction = {
    type: "ENSURE_FILE_PATH"
    dispatch: Dispatch<WorkbenchAction>
}

async function ensureFilePath(state: WorkbenchState, action: EnsureFilePathAction): Promise<void> {
    if (state.path) {
        return
    }

    startAsyncAction(state, action)

    const dispatch = action.dispatch
    const { filePath, canceled } = await ipcInvoker.askMarkdownFileForSave()
    if (canceled || !filePath) {
        dispatch({ type: "CLEAN_CURRENT_ACTION", payload: { action: action } })
    } else {
        dispatch({ type: "SET_NOTE_PATH", payload: { path: filePath } })
    }
}

type CleanCurrentActionAction = {
    type: "CLEAN_CURRENT_ACTION"
    payload: {
        action: WorkbenchAction
    }
}

function cleanCurrentAction(state: WorkbenchState, action: CleanCurrentActionAction): void {
    if (state.currentAction === action.payload.action) {
        state.currentAction = null
        state.currentActionStartTime = 0
    }
}

type SetIsSerializingAction = {
    type: "SET_IS_SERIALIZING"
    payload: {
        isSerializing: boolean
    }
}

type WorkbenchAction =
    | CloseWindowAction
    | SaveFileAction
    | SetNotePathAction
    | SetNoteContentAction
    | EnsureFilePathAction
    | CleanCurrentActionAction
    | DiscardContentAction
    | SetIsSerializingAction

function startAsyncAction(state: WorkbenchState, action: WorkbenchAction): WorkbenchState {
    console.assert(state.currentAction === null, "startAsyncAction should not be called when currentAction is not null")

    state.currentAction = action
    state.currentActionStartTime = Number(Date.now())
    return state
}

function throwUnknownActionError(action: never): never {
    throw new Error(`Unknown action type ${action}`)
}

function executeAction(state: WorkbenchState, action: WorkbenchAction): WorkbenchState {
    console.assert(state.currentAction === null, "executeAction should not be called when currentAction is not null")

    switch (action.type) {
        case "CLOSE_WINDOW":
            closeWindow(state, action)
            return state
        case "OPEN_FILE":
            state.path = action.payload.path
            state.content = action.payload.content
            return state
        case "SET_NOTE_PATH":
            state.path = action.payload.path
            return state
        case "SET_NOTE_CONTENT":
            state.content = action.payload.content
            return state
        case "ENSURE_FILE_PATH":
            ensureFilePath(state, action)
            return state
        case "CLEAN_CURRENT_ACTION":
            cleanCurrentAction(state, action)
            return state
        case "DISCARD_CONTENT":
            state.contentDiscarded = true
            return state
        case "SET_IS_SERIALIZING":
            state.isSerializing = action.payload.isSerializing
            return state
        default:
            throwUnknownActionError(action)
    }
}

function executePendingActions(state: WorkbenchState): WorkbenchState {
    console.assert(state.currentAction === null, "executePendingActions should not be called when currentAction is not null")

    while (state.currentAction === null) {
        const action = state.actionQueue.shift()
        if (!action) {
            // no action to execute, exit
            return state
        }

        state = executeAction(state, action)
    }

    return state
}

const ACTION_TIMEOUT = 30_000

function workbenchReducer(prevState: WorkbenchState, action: WorkbenchAction): WorkbenchState {
    return produce(prevState, (state: WorkbenchState): WorkbenchState => {
        // add the action to the queue
        state.actionQueue.push(action)

        if (state.currentAction) {
            // last action is not finished yet, check if it is timeout

            const during = Number(Date.now()) - state.currentActionStartTime
            if (during > ACTION_TIMEOUT) {
                // last action is timeout, delete it and start the next action
                state.currentAction = null
                state.currentActionStartTime = 0
            } else {
                // last action is not finished yet and not timeout, exit
                return state
            }
        }

        // pick the next action and execute it
        return executePendingActions(state)
    })
}

export function useWorkbench() {
    const [state, dispatch] = useReducer(workbenchReducer, initialState)

    useTitleEffect(state)

    const canCloseWindow = calcCanCloseWindow(state)

    // Try to close the window. Return true if the window can be closed immediately. Otherwise, a close action will be added to the queue and return false.
    const closeWindow = useCallback((): boolean => {
        if (canCloseWindow) {
            return true
        } else {
            dispatch({ type: "CLOSE_WINDOW", dispatch })
            return false
        }
    }, [canCloseWindow])

    const openFile = useCallback(({ path, content }: { path: string; content: string }) => {
        dispatch({ type: "OPEN_FILE", payload: { path, content } })
    }, [])

    const setNotePath = useCallback((path: string) => {
        dispatch({ type: "SET_NOTE_PATH", payload: { path } })
    }, [])

    const ensureFilePath = useCallback(() => {
        dispatch({ type: "ENSURE_FILE_PATH", dispatch })
    }, [])

    const setIsSerializing = useCallback((isSerializing: boolean) => {
        dispatch({ type: "SET_IS_SERIALIZING", payload: { isSerializing: true } })
    }, [])

    const setNoteContent = useCallback((content: string) => {
        dispatch({ type: "SET_NOTE_CONTENT", payload: { content } })
    }, [])

    return {
        state: {
            path: state.path,
            content: state.content,
        },
        handlers: {
            closeWindow,
            openFile,
            setNotePath,
            setNoteContent,
            ensureFilePath,
            setIsSerializing,
        },
    }
}
