import produce from "immer"
import { Dispatch, useCallback, useEffect, useReducer } from "react"

import { ipcInvoker } from "../ipc-renderer"
import { logger } from "../logger"
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

    actionQueue: WorkbenchAction[]

    runningAction: WorkbenchAction | null

    contentDiscarded: boolean

    // is running the irrevocable close window action
    isClosing: boolean
}

const initialState = Object.freeze<WorkbenchState>({
    content: "",
    path: "",

    isSerializing: false,
    isSaving: false,
    hasUnsavedChanges: false,

    actionQueue: [],

    runningAction: null,

    contentDiscarded: false,

    isClosing: false,
})

function calcCanCloseWindow(state: WorkbenchState): boolean {
    if (state.contentDiscarded) return true

    return !state.isSaving && !state.isSerializing && !state.hasUnsavedChanges && !!state.path
}

type DiscardContentAction = {
    type: "DISCARD_CONTENT"
}

type SetIsClosingAction = {
    type: "SET_IS_CLOSING"
}

type CloseWindowAction = {
    type: "CLOSE_WINDOW"
    dispatch: Dispatch<WorkbenchAction>
}

async function asyncCloseWindow(state: WorkbenchState, action: CloseWindowAction) {
    const dispatch = action.dispatch
    if (!state.path) {
        const { filePath, canceled, discarded } = await ipcInvoker.askMarkdownFileForClose()
        if (discarded) {
            // User discarded the content, close the window
            dispatch({ type: "DISCARD_CONTENT" })
            dispatch({ type: "SET_IS_CLOSING" })
        } else if (filePath && !canceled) {
            // User selected a file, save the content amd close the window
            dispatch({ type: "SET_NOTE_PATH", payload: { path: filePath } })
            dispatch({ type: "SAVE_FILE", dispatch })
            dispatch({ type: "SET_IS_CLOSING" })
        }
    } else {
        // Save the content and close the window
        dispatch({ type: "SET_IS_CLOSING" })
    }
}

// Try to close the window. Send a message to the main process to close current window if the window can be closed immediately.
// Otherwise, a close action will be added to the queue and try to close the window later.
function closeWindow(state: WorkbenchState, action: CloseWindowAction): void {
    const canCloseWindow = calcCanCloseWindow(state)
    if (canCloseWindow) {
        action.dispatch({ type: "SET_IS_CLOSING" })
    } else {
        startAsyncAction(state, action, asyncCloseWindow(state, action), action.dispatch)
    }
}

type OpenFileAction = {
    type: "OPEN_FILE"
    payload: {
        path: string
        content: string
    }
}

type SaveFileAction = {
    type: "SAVE_FILE"
    dispatch: Dispatch<WorkbenchAction>
}

async function asyncSaveFile(state: WorkbenchState, action: SaveFileAction) {
    await ipcInvoker.saveFile({ path: state.path, content: state.content })
    action.dispatch({ type: "FINISH_SAVE_FILE" })
}

function saveFile(state: WorkbenchState, action: SaveFileAction): void {
    if (!state.path) {
        return
    }
    startAsyncAction(state, action, asyncSaveFile(state, action), action.dispatch)
}

type FinishSaveFileAction = {
    type: "FINISH_SAVE_FILE"
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

async function asyncEnsureFilePath(state: WorkbenchState, action: EnsureFilePathAction): Promise<void> {
    const dispatch = action.dispatch
    const { filePath, canceled } = await ipcInvoker.askMarkdownFileForSave()
    if (!canceled && filePath) {
        dispatch({ type: "SET_NOTE_PATH", payload: { path: filePath } })
    }
}

function ensureFilePath(state: WorkbenchState, action: EnsureFilePathAction): void {
    if (state.path) {
        return
    }

    startAsyncAction(state, action, asyncEnsureFilePath(state, action), action.dispatch)
}

type CleanRunningActionAction = {
    type: "CLEAN_RUNNING_ACTION"
}

type SetIsSerializingAction = {
    type: "SET_IS_SERIALIZING"
    payload: {
        isSerializing: boolean
    }
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

const ASYNC_ACTION_TIMEOUT = 10000

function startAsyncAction(
    state: WorkbenchState,
    action: WorkbenchAction,
    promise: Promise<void>,
    dispatch: Dispatch<WorkbenchAction>,
): WorkbenchState {
    console.assert(state.runningAction === null, "startAsyncAction should not be called when runningAction is not null")

    state.runningAction = action
    createTimeoutPromise(promise, ASYNC_ACTION_TIMEOUT).then(() => dispatch({ type: "CLEAN_RUNNING_ACTION" }))
    return state
}

function throwUnknownActionError(action: never): never {
    throw new Error(`Unknown action type ${action}`)
}

function executeAction(state: WorkbenchState, action: WorkbenchAction): WorkbenchState {
    console.assert(state.runningAction === null, "executeAction should not be called when runningAction is not null")

    switch (action.type) {
        case "SET_IS_CLOSING":
            state.isClosing = true
            return state
        case "CLOSE_WINDOW":
            closeWindow(state, action)
            return state
        case "OPEN_FILE":
            state.path = action.payload.path
            state.content = action.payload.content
            return state
        case "SAVE_FILE":
            saveFile(state, action)
            return state
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
            ensureFilePath(state, action)
            return state
        case "DISCARD_CONTENT":
            state.contentDiscarded = true
            return state
        case "SET_IS_SERIALIZING":
            state.isSerializing = action.payload.isSerializing
            return state
        case "CLEAN_RUNNING_ACTION":
            return state // do nothing
        default:
            throwUnknownActionError(action)
    }
}

function executePendingActions(state: WorkbenchState): WorkbenchState {
    console.assert(!state.runningAction, "executePendingActions should not be called when runningAction is not null")

    while (!state.runningAction) {
        const action = state.actionQueue.shift()
        if (!action) {
            // no action to execute, exit
            return state
        }

        state = executeAction(state, action)
    }

    return state
}

function workbenchReducer(prevState: WorkbenchState, action: WorkbenchAction): WorkbenchState {
    return produce(prevState, (state: WorkbenchState): WorkbenchState => {
        if (action.type === "CLEAN_RUNNING_ACTION") {
            state.runningAction = null
        } else {
            // add the action to the queue
            state.actionQueue.push(action)
        }

        if (state.runningAction) {
            // last async action is not finished yet
            return state
        }

        // pick the next action and execute it
        return executePendingActions(state)
    })
}
const workbenchReducerWithLogger = withLogReducer(workbenchReducer)

export function useWorkbench() {
    const [state, dispatch] = useReducer(workbenchReducerWithLogger, initialState)

    useTitleEffect(state)

    const canCloseWindow = calcCanCloseWindow(state)

    useEffect(() => {
        dispatch({ type: "SAVE_FILE", dispatch })
    }, [state.content, state.hasUnsavedChanges, state.isClosing])

    useEffect(() => {
        if (state.isClosing && canCloseWindow) {
            ipcInvoker.closeWindow()
        }
    }, [state.isClosing, canCloseWindow])

    const closeWindow = useCallback((): void => {
        dispatch({ type: "CLOSE_WINDOW", dispatch })
    }, [])

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
        dispatch({ type: "SET_IS_SERIALIZING", payload: { isSerializing } })
    }, [])

    const setNoteContent = useCallback((content: string) => {
        dispatch({ type: "SET_NOTE_CONTENT", payload: { content } })
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
