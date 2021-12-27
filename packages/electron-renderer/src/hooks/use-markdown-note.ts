import { useCallback, useEffect, useReducer } from "react"

import { ipcInvoker } from "../ipc-renderer"
import { MarkdownNoteState } from "../types"
import { useTitle } from "./use-title"

type SetContentAction = {
    type: "SET_CONTENT"
    payload: { content: string }
}

type OpenFileAction = {
    type: "OPEN_FILE"
    payload: { content: string; path: string }
}

type PatchAction = {
    type: "PATCH"
    payload: Partial<MarkdownNoteState>
}

type StartSaveAction = {
    type: "START_SAVE"
    payload?: never
}

type FinishSaveAction = {
    type: "FINISH_SAVE"
    payload: { contentId: number }
}

function patch(state: MarkdownNoteState, action: PatchAction): MarkdownNoteState {
    let contentId: number = action.payload.contentId ?? state.contentId
    if (Object.hasOwnProperty.call(state, "content") && !Object.hasOwnProperty.call(state, "contentId")) {
        contentId = state.contentId + 1
    }

    return {
        ...state,
        ...action.payload,
        contentId,
    }
}

function startSave(state: MarkdownNoteState) {
    const contentId = state.contentId
    return {
        ...state,
        lastSavingStartTime: Number(Date.now()),
        savingContentId: contentId,
    }
}

function finishSave(state: MarkdownNoteState, action: FinishSaveAction) {
    const savedContentId = action.payload.contentId
    return {
        ...state,
        lastSavedContentId: Math.max(action.payload.contentId, savedContentId),
        savingContentId: state.savingContentId === savedContentId ? 0 : state.savingContentId,
    }
}

type MarkdownNoteAction = SetContentAction | OpenFileAction | PatchAction | StartSaveAction | FinishSaveAction

function throwUnknownActionError(action: never): never {
    throw new Error(`Unknown action type ${action}`)
}

function markdownNoteReducer(state: MarkdownNoteState, action: MarkdownNoteAction): MarkdownNoteState {
    switch (action.type) {
        case "SET_CONTENT":
            return { ...state, content: action.payload.content, contentId: state.contentId + 1 }
        case "OPEN_FILE":
            return { ...state, content: action.payload.content, contentId: state.contentId + 1, path: action.payload.path, deleted: false }
        case "PATCH":
            return patch(state, action)
        case "START_SAVE":
            return startSave(state)
        case "FINISH_SAVE":
            return finishSave(state, action)
        default:
            throwUnknownActionError(action)
    }
}

function calcCanUnmount(state: MarkdownNoteState): "can_unmount_now" | "can_unmount_after_save" | "need_path" {
    if (state.path) {
        // local file
        if (!state.isSerializing && !state.savingContentId) {
            return "can_unmount_now"
        } else {
            return "can_unmount_after_save"
        }
    } else {
        // in-memory file
        if (!state.content && !state.isSerializing) {
            return "can_unmount_now"
        } else {
            return "need_path"
        }
    }
}

function useCloseWindowEffect(
    state: MarkdownNoteState,
    dispatch: React.Dispatch<MarkdownNoteAction>,
    canUnmount: "can_unmount_now" | "can_unmount_after_save" | "need_path",
) {
    const tryToCloseWindow = useCallback(async () => {
        if (canUnmount === "can_unmount_now") {
            ipcInvoker.closeWindow()
        } else if (canUnmount === "can_unmount_after_save") {
            // wait for the saving
        } else if (canUnmount === "need_path") {
            const { filePath, discarded, canceled } = await ipcInvoker.askMarkdownFileForClose()
            if (canceled) {
                dispatch({
                    type: "PATCH",
                    payload: {
                        isWaittingToClose: false,
                    },
                })
            } else if (discarded) {
                ipcInvoker.closeWindow()
            } else {
                dispatch({
                    type: "PATCH",
                    payload: {
                        path: filePath,
                    },
                })
            }
        }
    }, [canUnmount, dispatch])

    // Close the window
    useEffect(() => {
        if (state.isWaittingToClose) {
            tryToCloseWindow()
        }
    }, [state.isWaittingToClose, tryToCloseWindow])
}

const SAVE_TIMEOUT = 30_000

function useSaveFileEffect(state: MarkdownNoteState, dispatch: React.Dispatch<MarkdownNoteAction>) {
    useEffect(() => {
        if (!state.path) {
            // don't save in-memory file
            return
        }

        if (state.savingContentId) {
            const now = Number(Date.now())
            if (now - state.lastSavingStartTime > SAVE_TIMEOUT) {
                // abort the saving
                dispatch({
                    type: "PATCH",
                    payload: {
                        lastSavingStartTime: 0,
                        savingContentId: 0,
                    },
                })
                return
            } else {
                // wait for the saving and do nothing
                return
            }
        }

        if (state.isSerializing) {
            // wait for the serializing and do nothing
            return
        }

        if (state.contentId === state.lastSavedContentId) {
            // current content has been saved and do nothing
            return
        }

        if (state.contentId > state.lastSavedContentId) {
            // start saving
            dispatch({ type: "START_SAVE" })
            ipcInvoker.saveFile({ content: state.content, path: state.path }).then(({ canceled }) => {
                if (!canceled) {
                    dispatch({
                        type: "FINISH_SAVE",
                        payload: {
                            contentId: state.contentId,
                        },
                    })
                }
            })
            return
        }

        if (state.contentId < state.lastSavedContentId) {
            // should not happen
            return
        }
    }, [dispatch, state])
}

export function useMarkdownNote() {
    const [state, dispatch] = useReducer(markdownNoteReducer, {
        content: "",
        contentId: 1,
        path: "",
        deleted: false,
        savingContentId: 0,
        lastSavedContentId: 0,
        lastSavingStartTime: 0,
        isSerializing: false,
        isWaittingToClose: false,
    })

    const canUnmount = calcCanUnmount(state)

    const title = useTitle(state)

    useEffect(() => {
        ipcInvoker.setTitle({ title })
    }, [title])

    useCloseWindowEffect(state, dispatch, canUnmount)

    useSaveFileEffect(state, dispatch)

    const openFile = useCallback(async (path?: string) => {
        const file = await ipcInvoker.openFile({ path })
        if (!file.canceled) {
            dispatch({
                type: "PATCH",
                payload: {
                    content: file.content,
                    path: file.path,
                    deleted: false,
                },
            })
        }
    }, [])

    const onContentSave = useCallback((content: string) => {
        dispatch({
            type: "SET_CONTENT",
            payload: {
                content,
            },
        })
    }, [])

    const setNotePath = useCallback((path: string) => {
        if (path) {
            dispatch({
                type: "PATCH",
                payload: {
                    path,
                },
            })
        }
    }, [])

    const ensureFilePath = useCallback(async () => {
        if (!state.path) {
            const { filePath } = await ipcInvoker.askMarkdownFileForSave()
            if (filePath) {
                setNotePath(filePath)
            }
        }
    }, [state.path, setNotePath])

    const setIsSerializing = useCallback((isSerializing: boolean) => {
        if (isSerializing) {
            dispatch({
                type: "PATCH",
                payload: {
                    isSerializing: true,
                },
            })
        } else {
            dispatch({
                type: "PATCH",
                payload: {
                    isSerializing: false,
                },
            })
        }
    }, [])

    const beforeCloseWindow = useCallback(() => {
        dispatch({
            type: "PATCH",
            payload: {
                isWaittingToClose: true,
            },
        })
    }, [])

    return {
        content: state.content,
        path: state.path,
        openFile,
        setNotePath,
        onContentSave,
        setIsSerializing,
        ensureFilePath,
        beforeCloseWindow,
        canUnmountNow: canUnmount === "can_unmount_now",
    }
}
