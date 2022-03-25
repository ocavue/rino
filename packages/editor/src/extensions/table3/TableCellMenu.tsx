import { useFloating } from "@floating-ui/react-dom"
import { NodeWithPosition } from "@remirror/core"
import { TableSchemaSpec } from "@remirror/extension-tables"
import { NodeType } from "@remirror/pm"
import { isCellSelection } from "@remirror/pm/tables"
import { useEditorView, useEvent, useHover, useRemirrorContext } from "@remirror/react"
import React, { useCallback, useEffect, useMemo } from "react"

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

function useHoverCell(handler: (cell: HTMLElement) => void) {
    const view = useEditorView()
    useHover((props) => {
        for (const { node, pos } of props.nodes) {
            if (isCellType(node.type)) {
                const dom = view.nodeDOM(pos)
                if (dom) {
                    handler(dom as HTMLElement)
                    break
                }
            }
        }
    })
}

function useButtonFloating() {
    const { x, y, reference, floating, strategy, refs } = useFloating({
        placement: "bottom-end",
        middleware: [],
    })

    const hoveredCellHandler = useCallback(
        (cell: HTMLElement) => {
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

    useHoverCell(hoveredCellHandler)

    return { x, y, refs, floating, strategy }
}

const TableCellMenu: React.FC = () => {
    const buttonFloating = useButtonFloating()
    if (!buttonFloating) return null

    const { x, y, floating, strategy } = buttonFloating

    console.log("[TableCellMenu]", x, y, strategy)

    return (
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
        >
            ...
        </button>
    )
}

export default TableCellMenu
