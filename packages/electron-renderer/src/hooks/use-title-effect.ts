import { useEffect, useMemo } from "react"

import { basename } from "@rino.app/common"

import { ipcRendererAsyncSender } from "../ipc-renderer"
import type { WorkbenchState } from "./use-workbench"

export function useTitleEffect(state: WorkbenchState): void {
    const title = useMemo(() => {
        let title = basename(state.path) || "Untitled"
        if (state.isSaving || state.isSerializing || state.hasUnsavedChanges) {
            title = `${title} - Edited`
        }
        return title
    }, [state.hasUnsavedChanges, state.isSaving, state.isSerializing, state.path])

    useEffect(() => {
        ipcRendererAsyncSender.setTitle({ title })
    }, [title])
}
