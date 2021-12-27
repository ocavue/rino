import { useMemo } from "react"

import { basename } from "@rino.app/common"

export function useTitle(notePath: string, hasUnsavedChanges: boolean, saving: boolean): string {
    return useMemo(() => {
        let title = basename(notePath)
        if (!title) {
            title = "Untitled"
        }
        if (saving || hasUnsavedChanges) {
            title = `${title} - Edited`
        }
        return title
    }, [notePath, saving, hasUnsavedChanges])
}
