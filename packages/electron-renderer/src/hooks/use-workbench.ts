import produce from "immer"
import isPromise from "is-promise"
import { Dispatch, useCallback, useEffect, useReducer } from "react"

import { ipcInvoker } from "../ipc-renderer"
import { createTimeoutPromise } from "../utils/create-timeout-promise"
import { withLogReducer } from "./reducer-logger"
import { useTitleEffect } from "./use-title-effect"

export type WorkbenchState = {
    content: string
    path: string

    // is wait for the editor to serialize the content
    isSerializing: boolean

    // is wait for the main process to save the file
    isSaving: boolean

    hasUnsavedChanges: boolean

    contentDiscarded: boolean

    // is running the irrevocable close window action
    isClosing: boolean

    actionQueue: WorkbenchAction[]
    hasRunningAction: boolean
}

const initialState = Object.freeze<WorkbenchState>({
    content: "",
    path: "",

    isSerializing: false,
    isSaving: false,
    hasUnsavedChanges: false,

    contentDiscarded: false,

    isClosing: false,

    actionQueue: [],
    hasRunningAction: false,
})

function calcCanCloseWindow(state: WorkbenchState): boolean {
    if (state.contentDiscarded) return true

    return !state.isSaving && !state.isSerializing && !state.hasUnsavedChanges && !!state.path
}

type DiscardContentAction = {
    type: "DISCARD_CONTENT"
    dispatch: WorkbenchDispatch
}

type SetIsClosingAction = {
    type: "SET_IS_CLOSING"
    dispatch: WorkbenchDispatch
}

type CloseWindowAction = {
    type: "CLOSE_WINDOW"
    dispatch: WorkbenchDispatch
}

async function asyncCloseWindow(state: WorkbenchState, action: CloseWindowAction): Promise<void> {
    const { dispatch } = action
    if (!state.path) {
        const { filePath, canceled, discarded } = await ipcInvoker.askMarkdownFileForClose()
        if (discarded) {
            // User discarded the content, close the window
            dispatch({ dispatch, type: "DISCARD_CONTENT" })
        } else if (filePath && !canceled) {
            // User selected a file, save the content and then close the window
            dispatch({ dispatch, type: "SET_NOTE_PATH", payload: { path: filePath } })
            dispatch({ dispatch, type: "SET_IS_CLOSING" })
        }
    } else {
        // Save the content and close the window
        dispatch({ dispatch, type: "SET_IS_CLOSING" })
    }
}

// Try to close the window. Send a message to the main process to close current window if the window can be closed immediately.
// Otherwise, a close action will be added to the queue and try to close the window later.
function closeWindow(state: WorkbenchState, action: CloseWindowAction): WorkbenchState | Promise<void> {
    const canCloseWindow = calcCanCloseWindow(state)
    if (canCloseWindow) {
        state.isClosing = true
        return state
    } else {
        return asyncCloseWindow(state, action)
    }
}

type OpenFileAction = {
    type: "OPEN_FILE"
    payload: {
        path: string
        content: string
    }
    dispatch: WorkbenchDispatch
}

type SaveFileAction = {
    type: "SAVE_FILE"
    dispatch: WorkbenchDispatch
}

async function asyncSaveFile(state: WorkbenchState, action: SaveFileAction) {
    await ipcInvoker.saveFile({ path: state.path, content: state.content })
    const { dispatch } = action
    dispatch({ dispatch, type: "FINISH_SAVE_FILE" })
}

function saveFile(state: WorkbenchState, action: SaveFileAction): WorkbenchState | Promise<void> {
    if (!state.path) {
        return state
    }
    return asyncSaveFile(state, action)
}

type FinishSaveFileAction = {
    type: "FINISH_SAVE_FILE"
    dispatch: WorkbenchDispatch
}

type SetNotePathAction = {
    type: "SET_NOTE_PATH"
    payload: {
        path: string
    }
    dispatch: WorkbenchDispatch
}

type SetNoteContentAction = {
    type: "SET_NOTE_CONTENT"
    payload: {
        content: string
    }
    dispatch: WorkbenchDispatch
}

type EnsureFilePathAction = {
    type: "ENSURE_FILE_PATH"
    dispatch: WorkbenchDispatch
}

async function asyncEnsureFilePath(state: WorkbenchState, action: EnsureFilePathAction): Promise<void> {
    const dispatch = action.dispatch
    const { filePath, canceled } = await ipcInvoker.askMarkdownFileForSave()
    if (!canceled && filePath) {
        dispatch({ dispatch, type: "SET_NOTE_PATH", payload: { path: filePath } })
    }
}

function ensureFilePath(state: WorkbenchState, action: EnsureFilePathAction): WorkbenchState | Promise<void> {
    if (state.path) {
        return state
    }

    return asyncEnsureFilePath(state, action)
}

type CleanRunningActionAction = {
    type: "CLEAN_RUNNING_ACTION"
    dispatch: WorkbenchDispatch
}

type SetIsSerializingAction = {
    type: "SET_IS_SERIALIZING"
    payload: {
        isSerializing: boolean
    }
    dispatch: WorkbenchDispatch
}

type WorkbenchAction =
    | SetIsClosingAction
    | CloseWindowAction
    | OpenFileAction
    | SaveFileAction
    | SetNotePathAction
    | SetNoteContentAction
    | FinishSaveFileAction
    | EnsureFilePathAction
    | CleanRunningActionAction
    | DiscardContentAction
    | SetIsSerializingAction

type WorkbenchDispatch = Dispatch<WorkbenchAction>

const ASYNC_ACTION_TIMEOUT = 10000

function throwUnknownActionError(action: never): never {
    throw new Error(`Unknown action type ${action}`)
}

function executeAction(state: WorkbenchState, action: WorkbenchAction): WorkbenchState | Promise<void> {
    console.assert(!state.hasRunningAction, "executeAction should not be called when hasRunningAction is true")

    switch (action.type) {
        case "SET_IS_CLOSING":
            state.isClosing = true
            return state
        case "CLOSE_WINDOW":
            return closeWindow(state, action)
        case "OPEN_FILE":
            state.path = action.payload.path
            state.content = action.payload.content
            return state
        case "SAVE_FILE":
            return saveFile(state, action)
        case "SET_NOTE_PATH":
            state.path = action.payload.path
            return state
        case "SET_NOTE_CONTENT":
            state.hasUnsavedChanges = state.hasUnsavedChanges || state.content !== action.payload.content
            state.content = action.payload.content
            return state
        case "FINISH_SAVE_FILE":
            state.isSaving = false
            state.hasUnsavedChanges = false
            return state
        case "ENSURE_FILE_PATH":
            return ensureFilePath(state, action)
        case "DISCARD_CONTENT":
            state.contentDiscarded = true
            state.isClosing = true
            return state
        case "SET_IS_SERIALIZING":
            state.isSerializing = action.payload.isSerializing
            return state
        case "CLEAN_RUNNING_ACTION":
            throw new Error(`${action.type} should not be added into the queue`)
        default:
            throwUnknownActionError(action)
    }
}

function executePendingActions(state: WorkbenchState, dispatch: WorkbenchDispatch): WorkbenchState {
    while (!state.hasRunningAction) {
        const action = state.actionQueue.shift()
        if (!action) {
            // no action to execute, exit
            return state
        }

        const stateOrPromise = executeAction(state, action)
        if (isPromise(stateOrPromise)) {
            state.hasRunningAction = true
            createTimeoutPromise(stateOrPromise, ASYNC_ACTION_TIMEOUT).then(() => {
                dispatch({ dispatch, type: "CLEAN_RUNNING_ACTION" })
            })
            return state
        } else {
            state = stateOrPromise
        }
    }

    return state
}

function workbenchReducer(prevState: WorkbenchState, action: WorkbenchAction): WorkbenchState {
    const dispatch = action.dispatch
    return produce(prevState, (state: WorkbenchState): WorkbenchState => {
        if (action.type === "CLEAN_RUNNING_ACTION") {
            state.hasRunningAction = false
        } else {
            // add the action to the queue
            state.actionQueue.push(action)
        }

        // pick the actions from the queue and execute it
        return executePendingActions(state, dispatch)
    })
}
const workbenchReducerWithLogger = withLogReducer(workbenchReducer)

export function useWorkbench() {
    const [state, dispatch] = useReducer(workbenchReducerWithLogger, initialState)

    useTitleEffect(state)

    const canCloseWindow = calcCanCloseWindow(state)

    useEffect(() => {
        dispatch({ dispatch, type: "SAVE_FILE" })
    }, [state.content, state.hasUnsavedChanges, state.isClosing])

    useEffect(() => {
        if (state.isClosing && canCloseWindow) {
            ipcInvoker.closeWindow()
        }
    }, [state.isClosing, canCloseWindow])

    const closeWindow = useCallback((): void => {
        dispatch({ dispatch, type: "CLOSE_WINDOW" })
    }, [])

    const openFile = useCallback(({ path, content }: { path: string; content: string }) => {
        dispatch({ dispatch, type: "OPEN_FILE", payload: { path, content } })
    }, [])

    const setNotePath = useCallback((path: string) => {
        dispatch({ dispatch, type: "SET_NOTE_PATH", payload: { path } })
    }, [])

    const ensureFilePath = useCallback(() => {
        dispatch({ dispatch, type: "ENSURE_FILE_PATH" })
    }, [])

    const setIsSerializing = useCallback((isSerializing: boolean) => {
        dispatch({ dispatch, type: "SET_IS_SERIALIZING", payload: { isSerializing } })
    }, [])

    const setNoteContent = useCallback((content: string) => {
        dispatch({ dispatch, type: "SET_NOTE_CONTENT", payload: { content } })
    }, [])

    return {
        state: {
            path: state.path,
            content: state.content,
            canCloseWindow,
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
