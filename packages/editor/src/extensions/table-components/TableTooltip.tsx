import { flip, VirtualElement } from "@floating-ui/dom"
import { autoUpdate, hide, offset, shift, useFloating } from "@floating-ui/react-dom"
import { isCellSelection } from "@remirror/pm/tables"
import { More2LineIcon } from "@remirror/react-components/all-icons"
import { useRemirrorContext } from "@remirror/react-core"
import React, { useCallback, useEffect, useState } from "react"

import { isTableCellElement } from "./dom-utils"
import { countCellSelection } from "./table-utils"
import { TableMenu } from "./TableMenu"

function calcCellSelectionBoundingClientRect(
    cellA: Element,
    cellB: Element,
): {
    top: number
    bottom: number
    left: number
    right: number
} {
    const rectA = cellA.getBoundingClientRect()
    const rectB = cellB.getBoundingClientRect()

    return {
        top: Math.min(rectA.top, rectB.top),
        bottom: Math.max(rectA.bottom, rectB.bottom),
        left: Math.min(rectA.left, rectB.left),
        right: Math.max(rectA.right, rectB.right),
    }
}

function findTableByCell(cellEl: Element) {
    let current: Element | null = cellEl
    while (current) {
        if (current.nodeName === "TABLE") {
            return current
        }
        current = current.parentElement
    }
    return null
}

type TableMenuButtonProps = {
    handleClick: (event: React.MouseEvent) => void
    anchorCellEl: Element
    headCellEl: Element
}

const TableMenuButton: React.FC<TableMenuButtonProps> = ({ handleClick, anchorCellEl: cellA, headCellEl: cellB }) => {
    const rect = calcCellSelectionBoundingClientRect(cellA, cellB)
    const tableEl = findTableByCell(cellA)
    const { x, y, floating, strategy, middlewareData } = useFloatingMenuFloating(rect, tableEl)
    const referenceHidden = middlewareData.hide?.referenceHidden

    return (
        <div
            ref={floating}
            style={{
                position: strategy,
                top: y ?? "",
                left: x ?? "",
                opacity: referenceHidden ? 0 : 1,

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

function useFloatingMenuFloating(
    { top, bottom, left, right }: { top: number; bottom: number; left: number; right: number },
    contextElement: Element | null,
) {
    const useFloatingReturn = useFloating({
        placement: "top",
        middleware: [offset(20), shift(), flip(), hide()],
    })

    const { reference, refs, update } = useFloatingReturn

    const updateFloating = useCallback(() => {
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
            contextElement: contextElement ?? undefined,
        }

        reference(virtualEl)
        update()
    }, [contextElement, reference, update, top, bottom, left, right])

    useEffect(() => {
        updateFloating()
    }, [updateFloating])

    useEffect(() => {
        if (!contextElement || !refs.floating.current) {
            return
        }
        return autoUpdate(contextElement, refs.floating.current, updateFloating)
    }, [contextElement, refs.floating, updateFloating])

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

    const anchorCellEl = view.nodeDOM(selection.$anchorCell.pos) as HTMLElement | null
    const headCellEl = view.nodeDOM(selection.$headCell.pos) as HTMLElement | null

    if (!isTableCellElement(anchorCellEl) || !isTableCellElement(headCellEl)) {
        return null
    }

    if (countCellSelection(selection) <= 1) {
        return null
    }

    return (
        <>
            <TableMenuButton handleClick={handleClick} anchorCellEl={anchorCellEl} headCellEl={headCellEl} />
            <TableMenu event={event} handleClose={handleClose} />
        </>
    )
}
