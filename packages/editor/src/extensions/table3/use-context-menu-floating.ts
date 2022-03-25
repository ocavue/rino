import { shift, useFloating, UseFloatingReturn } from "@floating-ui/react-dom"
import React, { useCallback } from "react"

import { useOnClickOutside } from "./use-on-click-outside"

export function useContextMenuFloating() {
    const [showMenu, setShowMenu] = React.useState(false)

    const closeMenu = useCallback(() => {
        setShowMenu(false)
    }, [])

    const { x, y, reference, floating, strategy, refs } = useFloating({
        placement: "right-start",
        middleware: [
            shift({
                mainAxis: true,
                crossAxis: true,
            }),
        ],
    })

    console.log("[TableContextMenu]", { x, y, showMenu })

    useOnClickOutside(refs.floating, closeMenu)

    const clickHandler = useCallback(
        (event: MouseEvent | React.MouseEvent) => {
            const selector = event.target as HTMLElement
            console.log("selector:", selector.getBoundingClientRect())

            setShowMenu(true)

            const { clientX, clientY } = event
            const virtualEl = {
                getBoundingClientRect() {
                    return {
                        width: 0,
                        height: 0,
                        x: clientX,
                        y: clientY,
                        top: clientY,
                        left: clientX,
                        right: clientX,
                        bottom: clientY,
                    }
                },
                contextElement: selector,
            }
            reference(virtualEl)
        },
        [reference],
    )

    return {
        showMenu,
        x,
        y,
        floating,
        strategy,
        refs,
        clickHandler,
    }
}
