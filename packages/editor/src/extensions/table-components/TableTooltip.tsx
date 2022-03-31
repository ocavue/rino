import { VirtualElement } from "@floating-ui/dom"
import { offset, shift, useFloating } from "@floating-ui/react-dom"
import { CellSelection, isCellSelection } from "@remirror/pm/tables"
import { EditorView } from "@remirror/pm/view"
import { More2LineIcon } from "@remirror/react-components/all-icons"
import { useRemirrorContext } from "@remirror/react-core"
import React, { useCallback, useEffect, useState } from "react"

import { countCellSelection } from "./table-utils"
import { TableMenu } from "./TableMenu"

function getCellSelectionBoundingClientRect(
    view: EditorView,
    selection: CellSelection,
): {
    top: number
    bottom: number
    left: number
    right: number
} | null {
    const cellA = view.nodeDOM(selection.$anchorCell.pos) as HTMLElement | null
    const cellB = view.nodeDOM(selection.$headCell.pos) as HTMLElement | null

    if (!cellA || !cellB) return null
    if (cellA.nodeName !== "TD" && cellA.nodeName !== "TH") return null
    if (cellB.nodeName !== "TD" && cellB.nodeName !== "TH") return null

    const rectA = cellA.getBoundingClientRect()
    const rectB = cellB.getBoundingClientRect()

    return {
        top: Math.min(rectA.top, rectB.top),
        bottom: Math.max(rectA.bottom, rectB.bottom),
        left: Math.min(rectA.left, rectB.left),
        right: Math.max(rectA.right, rectB.right),
    }
}

type TableMenuButtonProps = {
    rect: { top: number; left: number; bottom: number; right: number }
    handleClick: (event: React.MouseEvent) => void
}

export const TableMenuButton: React.FC<TableMenuButtonProps> = ({ rect, handleClick }) => {
    const { x, y, floating, strategy } = useFloatingMenuFloating(rect)

    return (
        <div
            ref={floating}
            style={{
                position: strategy,
                top: y ?? "",
                left: x ?? "",

                zIndex: 11,
                width: "24px",
                height: "24px",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "4px",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: "rgba(0, 0, 0, 0.1)",
                background: "#fff",
            }}
            onClick={handleClick}
        >
            <More2LineIcon size="24px" />
        </div>
    )
}

function useFloatingMenuFloating({ top, bottom, left, right }: { top: number; bottom: number; left: number; right: number }) {
    // TODO: add autoUpdate

    const useFloatingReturn = useFloating({
        placement: "top",
        middleware: [
            offset(20),
            shift({
                mainAxis: true,
                crossAxis: true,
            }),
        ],
    })

    const { reference } = useFloatingReturn

    useEffect(() => {
        const virtualEl: VirtualElement = {
            getBoundingClientRect() {
                return {
                    top,
                    bottom,
                    left,
                    right,

                    x: left,
                    y: top,
                    width: right - left,
                    height: bottom - top,
                }
            },
        }

        reference(virtualEl)
    }, [bottom, left, reference, right, top])

    return useFloatingReturn
}

/**
 * A button that floats above the selected table cells. When clicked, it shows a menu to operate on the table.
 */
export const TableTooltip: React.FC = () => {
    const [event, setEvent] = useState<React.MouseEvent | null>(null)

    const handleClick = useCallback((event: React.MouseEvent) => {
        setEvent(event)
    }, [])

    const handleClose = useCallback(() => {
        setEvent(null)
    }, [])

    const { view } = useRemirrorContext({ autoUpdate: true })
    if (!view) {
        return null
    }

    const selection = view.state.selection

    if (!isCellSelection(selection)) {
        return null
    }

    const rect = getCellSelectionBoundingClientRect(view, selection)

    if (!rect) {
        return null
    }

    if (countCellSelection(selection) <= 1) {
        return null
    }

    return (
        <>
            <TableMenuButton rect={rect} handleClick={handleClick} />
            <TableMenu event={event} handleClose={handleClose} />
        </>
    )
}
