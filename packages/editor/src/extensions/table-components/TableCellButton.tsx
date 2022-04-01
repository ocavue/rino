import { autoUpdate, useFloating, VirtualElement } from "@floating-ui/react-dom"
import { ProsemirrorNode } from "@remirror/pm"
import { useEditorView, useHover } from "@remirror/react"
import { More2LineIcon } from "@remirror/react-components/all-icons"
import React, { useCallback, useEffect } from "react"

import { selectCell } from "./table-helpers"
import { isCellType } from "./table-utils"
import { TableMenu } from "./TableMenu"

/**
 * Returns the hovered table cell.
 */
function useHoeveredCell(): { dom: HTMLElement; pos: number; node: ProsemirrorNode } | null {
    const view = useEditorView()
    const [cell, setCell] = React.useState<{ dom: HTMLElement; pos: number; node: ProsemirrorNode } | null>(null)

    useHover((props) => {
        if (!props.hovering) {
            return
        }

        for (const { node, pos } of props.nodes) {
            if (isCellType(node.type)) {
                const dom = view.nodeDOM(pos)
                if (dom) {
                    setCell({
                        dom: dom as HTMLElement,
                        pos,
                        node,
                    })
                    return
                }
            }
        }

        setCell(null)
    })

    return cell
}

/**
 * Returns the position of the cell menu button.
 */
function useButtonFloating(cellEl: Element | null) {
    const floating = useFloating({
        placement: "bottom-end",
        middleware: [],
    })

    const { reference, refs, update } = floating

    const updateFloating = useCallback(() => {
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
        update()
    }, [cellEl, reference, update])

    useEffect(() => {
        if (!cellEl || !refs.floating.current) {
            return
        }

        return autoUpdate(cellEl, refs.floating.current, updateFloating)
    }, [cellEl, updateFloating, refs.floating])

    return floating
}

type TableCellButtonComponentProps = {
    cellEl: Element | null
    handleClick: (event: React.MouseEvent) => void
}

const TableCellButtonComponent: React.FC<TableCellButtonComponentProps> = ({ cellEl, handleClick }) => {
    const { x, y, floating, strategy } = useButtonFloating(cellEl)
    const show = Boolean(cellEl)

    return show ? (
        <div
            ref={floating}
            style={{
                position: strategy,
                top: y ?? "",
                left: x ?? "",

                zIndex: 10,
                width: "20px",
                height: "20px",
                padding: "8px 0px",
                cursor: "pointer",
            }}
            onClick={handleClick}
        >
            <More2LineIcon size={"24px"} />
        </div>
    ) : null
}

/**
 * A button that floats above the hovered table cell. When clicked, it shows a menu to operate on the table.
 */
export const TableCellButton: React.FC = () => {
    const cell = useHoeveredCell()
    const view = useEditorView()

    const [event, setEvent] = React.useState<React.MouseEvent | null>(null)

    const handleClick = useCallback(
        (event: React.MouseEvent) => {
            if (cell?.pos) {
                // TODO: move it to a command
                const tr = view.state.tr
                selectCell(tr, cell.pos)
                view.dispatch(tr)
            }
            setEvent(event)
        },
        [cell?.pos, view],
    )

    const handleClose = useCallback(() => {
        setEvent(null)
    }, [])

    const cellEl = cell?.pos ? (view.nodeDOM(cell.pos) as Element | null) : null

    return (
        <>
            <TableCellButtonComponent cellEl={cellEl} handleClick={handleClick} />
            <TableMenu handleClose={handleClose} event={event} />
        </>
    )
}
