import { VirtualElement } from "@floating-ui/dom"
import { useFloating } from "@floating-ui/react-dom"
import { useEditorView, useHover } from "@remirror/react"
import React, { useCallback, useEffect } from "react"

import { isCellType } from "./table-utils"
import { TableMenu } from "./TableMenu"

/**
 * Returns the hovered table cell element.
 */
function useHoeveredCell(): HTMLElement | null {
    const view = useEditorView()
    const [cellEl, setCellEl] = React.useState<HTMLElement | null>(null)

    useHover((props) => {
        if (!props.hovering) {
            return
        }

        for (const { node, pos } of props.nodes) {
            if (isCellType(node.type)) {
                const dom = view.nodeDOM(pos)
                if (dom) {
                    setCellEl(dom as HTMLElement)
                    return
                }
            }
        }

        setCellEl(null)
    })

    return cellEl
}

/**
 * Returns the position of the cell menu button.
 */
function useButtonFloating(cellEl: HTMLElement | null) {
    const floating = useFloating({
        placement: "bottom-end",
        middleware: [],
    })

    const { reference } = floating

    useEffect(() => {
        if (!cellEl) return

        const rect = cellEl.getBoundingClientRect()
        const virtualRect = {
            width: rect.width,
            height: 0,
            x: rect.x,
            y: rect.y,
            top: rect.top,
            left: rect.left,
            right: rect.right,
            bottom: rect.top,
        }
        const virtualEl: VirtualElement = {
            getBoundingClientRect() {
                return virtualRect
            },
            contextElement: cellEl,
        }
        reference(virtualEl)
    }, [cellEl, reference])

    return floating
}

type TableCellButtonComponentProps = {
    cellEl: HTMLElement | null
    handleClick: (event: React.MouseEvent) => void
}

const TableCellButtonComponent: React.FC<TableCellButtonComponentProps> = ({ cellEl, handleClick }) => {
    const { x, y, floating, strategy } = useButtonFloating(cellEl)
    const show = Boolean(cellEl)

    return show ? (
        <button
            ref={floating}
            style={{
                zIndex: 10000,
                position: strategy,
                top: y ?? "",
                left: x ?? "",
                background: "lightyellow",
                borderRadius: "4px",
            }}
            onClick={handleClick}
        >
            ...
        </button>
    ) : null
}

/**
 * A button that floats above the hovered table cell. When clicked, it shows a menu to operate on the table.
 */
export const TableCellMenu: React.FC = () => {
    const cellEl = useHoeveredCell()

    const [event, setEvent] = React.useState<React.MouseEvent | null>(null)

    const handleClick = useCallback((event: React.MouseEvent) => {
        setEvent(event)
    }, [])

    const handleClose = useCallback(() => {
        setEvent(null)
    }, [])

    return (
        <>
            <TableCellButtonComponent cellEl={cellEl} handleClick={handleClick} />
            <TableMenu handleClose={handleClose} event={event} />
        </>
    )
}
