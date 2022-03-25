import { autoUpdate, useFloating } from "@floating-ui/react-dom"
import { NodeWithPosition } from "@remirror/core"
import { TableSchemaSpec } from "@remirror/extension-tables"
import { NodeType } from "@remirror/pm"
import { isCellSelection } from "@remirror/pm/tables"
import { useEditorView, useEvent, useHover, useRemirrorContext } from "@remirror/react"
import React, { useCallback, useEffect, useMemo, useState } from "react"

const TableCellMenuButton: React.FC = () => {
    return <button>...</button>
}

function useSelectedCell() {
    const { view } = useRemirrorContext({ autoUpdate: true })
    const selection = view.state.selection
    if (isCellSelection(selection)) return null
    return null
}

function isCellType(type: NodeType): boolean {
    return (type.spec as TableSchemaSpec).tableRole === "cell"
}

function useHoverCell(): HTMLElement | null {
    const view = useEditorView()
    const [cell, setCell] = React.useState<HTMLElement | null>(null)

    useHover((props) => {
        if (!props.hovering) {
            return
        }

        for (const { node, pos } of props.nodes) {
            if (isCellType(node.type)) {
                const dom = view.nodeDOM(pos)
                if (dom) {
                    setCell(dom as HTMLElement)
                    return
                }
            }
        }

        setCell(null)
    })

    return cell
}

function useButtonFloating() {
    const [showMenu, setShowMenu] = useState(false)

    const { x, y, reference, floating, strategy, refs, update } = useFloating({
        placement: "bottom-end",
        middleware: [],
    })

    const hoveredCellHandler = useCallback(
        (cell: HTMLElement | null) => {
            if (!cell) {
                setShowMenu(false)
                reference(null)
                return
            }

            setShowMenu(true)

            const rect = cell.getBoundingClientRect()
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
            const virtualEl = {
                getBoundingClientRect() {
                    return virtualRect
                },
                contextElement: cell,
            }
            reference(virtualEl)
        },
        [reference],
    )

    const view = useEditorView()

    const dom = useHoverCell()

    useEffect(() => {
        hoveredCellHandler(dom)
    }, [dom, hoveredCellHandler, update, view.state])

    return { showMenu, x, y, refs, floating, strategy }
}

const TableCellMenu: React.FC = () => {
    const { showMenu, x, y, floating, strategy } = useButtonFloating()

    return (
        <button
            ref={floating}
            style={{
                display: showMenu ? "block" : "none",
                zIndex: 10000,
                position: strategy,
                top: y ?? "",
                left: x ?? "",
                background: "lightyellow",
                borderRadius: "4px",
            }}
        >
            ...
        </button>
    )
}

export default TableCellMenu
