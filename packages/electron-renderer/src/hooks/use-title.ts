import { useMemo } from "react"

import { basename } from "@rino.app/common"

import { MarkdownNoteState } from "../types"

export function useTitle(state: MarkdownNoteState): string {
    return useMemo(() => {
        let title = basename(state.path)
        if (!title) {
            title = "Untitled"
        }
        if (state.savingContentId || state.isSerializing) {
            title = `${title} - Edited`
        }
        return title
    }, [state.isSerializing, state.path, state.savingContentId])
}
