import { isHotkey } from "is-hotkey"
import { useEffect } from "react"

/**
 * Shortcut format examples: mod+s, cmd+alt+space
 */
export function useShortcut(shortcut: string, callback: (event: KeyboardEvent) => void) {
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (isHotkey(shortcut, event)) {
                callback(event)
            }
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [callback, shortcut])
}
