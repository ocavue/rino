import { shift, useFloating } from "@floating-ui/react-dom"
import React, { useCallback } from "react"

import { useOnClickOutside } from "./use-on-click-outside"

type UseFloatingReturn = ReturnType<typeof useFloating>

export type UseContextMenuFloatingReturn = UseFloatingReturn & {
    show: boolean
    clickHandler: (event: MouseEvent | React.MouseEvent) => void
}

export function useContextMenuFloating(): UseContextMenuFloatingReturn {
    const [show, setShowMenu] = React.useState(false)

    const closeMenu = useCallback(() => {
        setShowMenu(false)
    }, [])

    const useFloatingReturn = useFloating({
        placement: "right-start",
        middleware: [
            shift({
                mainAxis: true,
                crossAxis: true,
            }),
        ],
    })

    const { reference, refs } = useFloatingReturn

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

    return { ...useFloatingReturn, show, clickHandler }
}
