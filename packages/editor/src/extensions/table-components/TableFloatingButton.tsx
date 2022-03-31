import { offset, shift, Strategy, useFloating } from "@floating-ui/react-dom"
import { CellSelection, isCellSelection } from "@remirror/pm/tables"
import { EditorView } from "@remirror/pm/view"
import { useRemirrorContext } from "@remirror/react-core"
import React, { useEffect, useMemo } from "react"

import { TableMenu } from "./TableMenu"

type TableMenuButtonProps = {
    x: number | null
    y: number | null
    floating: (node: HTMLElement | null) => void
    strategy: Strategy
}

export const TableMenuButton: React.FC<TableMenuButtonProps> = ({ x, y, floating, strategy }) => {
    const [event, setEvent] = React.useState<React.MouseEvent | null>(null)

    const handleClick = (event: React.MouseEvent) => {
        setEvent(event)
    }

    const handleClose = () => {
        setEvent(null)
    }

    return (
        <>
            <button
                ref={floating}
                style={{
                    zIndex: 10000,
                    position: strategy,
                    top: y ?? "",
                    left: x ?? "",
                    background: "lightgray",
                    borderRadius: "4px",
                }}
                onClick={handleClick}
            >
                ...
            </button>
            <TableMenu handleClose={handleClose} event={event} />
        </>
    )
}

type BoundingClientRect = {
    bottom: number
    height: number
    left: number
    right: number
    top: number
    width: number
    x: number
    y: number
}

function getCellSelectionBoundingClientRect(view: EditorView, selection: CellSelection): BoundingClientRect | null {
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

    return {
        bottom,
        left,
        right,
        top,
        height: bottom - top,
        width: right - left,
        x: left,
        y: top,
    }
}

function useFloatingMenuFloating(_rect: BoundingClientRect) {
    const rectJSON = JSON.stringify(_rect)
    const rect: BoundingClientRect = useMemo(() => JSON.parse(rectJSON), [rectJSON])

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

    const virtualEl = useMemo(
        () => ({
            getBoundingClientRect() {
                return rect
            },
        }),
        [rect],
    )
    useEffect(() => {
        reference(virtualEl)
    }, [reference, virtualEl])

    return useFloatingReturn
}

function TableSelectionMenuBody({ rect }: { rect: BoundingClientRect }): JSX.Element | null {
    const { x, y, floating, strategy } = useFloatingMenuFloating(rect)

    return <TableMenuButton x={x} y={y} floating={floating} strategy={strategy} />
}

export const TableFloatingButton: React.FC = () => {
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

    return <TableSelectionMenuBody rect={rect} />
}
