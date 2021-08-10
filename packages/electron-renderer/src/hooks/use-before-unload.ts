import { useEffect } from "react"

import { MarkdownNote } from "../types"

export function useBeforeUnload(note: MarkdownNote, ensureFilePath: () => void) {
    useEffect(() => {
        // Note: There is a subtle difference between the behaviors of `window.onbeforeunload = handler` and
        // `window.addEventListener('beforeunload', handler)`.
        window.onbeforeunload = (e) => {
            if (!note.path) {
                ensureFilePath()

                // Unlike usual browsers that a message box will be prompted to users, returning
                // a non-void value will silently cancel the close.
                // It is recommended to use the dialog API to let the user confirm closing the
                // application.
                e.returnValue = false // equivalent to `return false` but not recommended
            }
        }
    }, [note.path, ensureFilePath])
}
