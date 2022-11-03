import { css } from "@emotion/css"
import { FindReplaceComponent } from "@remirror/react"
import React, { FC, useCallback, useEffect, useRef, useState } from "react"

import { useShortcut } from "../../hooks/use-shortcut"

function useFindReplaceOpen() {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    const focus = useCallback(() => {
        const input = ref.current?.querySelector("input")
        if (input && document.activeElement !== input) {
            input.focus()
            return true
        }
        return false
    }, [])

    useEffect(() => {
        if (open) {
            focus()
        }
    }, [focus, open])

    useShortcut(
        "mod+f",
        useCallback(
            (event) => {
                // Open the find replace component if it's not already open.
                if (!open) {
                    setOpen(true)
                    event.preventDefault()
                    return
                }

                // Focus the input if it's open but not focused.
                if (focus()) {
                    event.preventDefault()
                    return
                }

                // Fall back to the default behavior (open the browser find).
            },
            [focus, open],
        ),
    )

    useShortcut(
        "escape",
        useCallback(() => {
            setOpen(false)
        }, []),
    )

    const close = useCallback(() => {
        setOpen(false)
    }, [])

    return { open, ref, close }
}

export const FindReplace: FC = () => {
    const { open, ref, close } = useFindReplaceOpen()

    if (!open) return null

    const height = "70px"

    return (
        <>
            <div
                className={css`
                    height: ${height};
                `}
            ></div>
            <div
                ref={ref}
                className={css`
                    height: ${height};
                    position: fixed;
                    left: 0;
                    right: 0;
                    top: 0;
                    z-index: 1000000;
                    background-color: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(8px);
                    padding: 8px;
                `}
            >
                <FindReplaceComponent onDismiss={close} />
            </div>
        </>
    )
}
