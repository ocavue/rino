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
    const cell1 = view.nodeDOM(selection.$anchorCell.pos) as HTMLElement | null
    const cell2 = view.nodeDOM(selection.$headCell.pos) as HTMLElement | null

    if (!cell1 || !cell2) return null
    if (cell1.nodeName !== "TD" && cell1.nodeName !== "TH") return null
    if (cell2.nodeName !== "TD" && cell2.nodeName !== "TH") return null

    const rect1 = cell1.getBoundingClientRect()
    const rect2 = cell2.getBoundingClientRect()

    const left = Math.min(rect1.left, rect2.left)
    const top = Math.min(rect1.top, rect2.top)
    const right = Math.max(rect1.right, rect2.right)
    const bottom = Math.max(rect1.bottom, rect2.bottom)

    return { left, top, right, bottom }
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
                padding: "8px",
                cursor: "pointer",
                borderRadius: "4px",
                backgroundColor: "#dcdcdc",
            }}
            onClick={handleClick}
        >
            <More2LineIcon size="24px" />
        </div>
    )
}

function useFloatingMenuFloating({ top, bottom, left, right }: { top: number; bottom: number; left: number; right: number }) {
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
