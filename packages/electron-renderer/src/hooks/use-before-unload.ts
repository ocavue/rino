import { useEffect } from "react"

export function useBeforeUnload(beforeUnload: () => { canUnload: boolean }) {
    useEffect(() => {
        // Note: There is a subtle difference between the behaviors of `window.onbeforeunload = handler` and
        // `window.addEventListener('beforeunload', handler)`.
        window.onbeforeunload = () => {
            const { canUnload } = beforeUnload()
            if (canUnload) {
                return
            } else {
                // Unlike usual browsers that a message box will be prompted to users, returning
                // a non-void value will silently cancel the close.
                // It is recommended to use the dialog API to let the user confirm closing the
                // application.
                return false
            }
        }
    }, [beforeUnload])
}
