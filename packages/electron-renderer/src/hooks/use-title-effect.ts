import { useEffect, useMemo } from "react"

import { basename } from "@rino.app/common"

import { ipcInvoker } from "../ipc-renderer"
import type { WorkbenchState } from "./use-workbench"

export function useTitleEffect(state: WorkbenchState): void {
    const title = useMemo(() => {
        let title = basename(state.path)
        if (!title) {
            title = "Untitled"
            if (!state.content) {
                // return title
            }
        }
        if (state.isSaving || state.isSerializing) {
            title = `${title} - Edited`
        }
        return title
    }, [state.content, state.isSaving, state.isSerializing, state.path])

    console.log("useTitleEffect", title, {
        content: !!state.content,
        isSaving: !!state.isSaving,
        isSerializing: !!state.isSerializing,
        path: !!state.path,
    })

    useEffect(() => {
        ipcInvoker.setTitle({ title })
    }, [title])
}
