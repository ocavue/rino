import { shift, useFloating, VirtualElement } from "@floating-ui/react"
import { useEffect } from "react"

import { useOnClickOutside } from "./use-on-click-outside"

export type UseFloatingReturn = ReturnType<typeof useFloating>

export type UseTableMenuProps = {
    handleClose: () => void
    coords?: { x: number; y: number } | null
}

export function useTableMenu({ handleClose, coords }: UseTableMenuProps): UseFloatingReturn {
    const useFloatingReturn = useFloating({
        placement: "right-start",
        middleware: [
            shift({
                mainAxis: true,
                crossAxis: true,
            }),
        ],
    })

    const { refs } = useFloatingReturn

    useOnClickOutside(refs.floating, handleClose)

    useEffect(() => {
        if (!coords) return
        const { x, y } = coords
        const virtualEl: VirtualElement = {
            getBoundingClientRect() {
                return {
                    width: 0,
                    height: 0,
                    x: x,
                    y: y,
                    top: y,
                    left: x,
                    right: x,
                    bottom: y,
                }
            },
        }
        refs.setReference(virtualEl)
    }, [coords, refs])

    return useFloatingReturn
}
