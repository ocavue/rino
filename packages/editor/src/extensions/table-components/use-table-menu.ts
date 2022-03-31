import type { VirtualElement } from "@floating-ui/dom"
import { shift, useFloating } from "@floating-ui/react-dom"
import React, { useEffect } from "react"

import { useOnClickOutside } from "./use-on-click-outside"

export type UseFloatingReturn = ReturnType<typeof useFloating>

export type UseTableMenuProps = {
    handleClose: () => void
    event: MouseEvent | React.MouseEvent | null
}

export function useTableMenu({ handleClose, event }: UseTableMenuProps): UseFloatingReturn {
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

    useOnClickOutside(refs.floating, handleClose)

    useEffect(() => {
        if (!event) return

        const { clientX, clientY, target: selectorEl } = event
        const virtualEl: VirtualElement = {
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
            contextElement: selectorEl as Element,
        }
        reference(virtualEl)
    }, [event, reference])


    return useFloatingReturn
}
