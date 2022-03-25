import { useFloating } from "@floating-ui/react-dom"
import { NodeWithPosition } from "@remirror/core"
import { TableSchemaSpec } from "@remirror/extension-tables"
import { NodeType } from "@remirror/pm"
import { isCellSelection } from "@remirror/pm/tables"
import { useEditorView, useEvent, useRemirrorContext } from "@remirror/react"
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

function useHoveredCell(hoverdCellHandler: (dom: HTMLElement) => void) {
    const view = useEditorView()

    useEvent("hover", (props) => {
        for (const nodeWithPos of props.nodes) {
            if (isCellType(nodeWithPos.node.type)) {
                const dom = view.nodeDOM(nodeWithPos.pos)
                if (dom) {
                    hoverdCellHandler(dom as HTMLElement)
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
        (dom: HTMLElement) => {
            const rect = dom.getBoundingClientRect()

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
                contextElement: dom,
            }

            reference(virtualEl)
        },
        [reference],
    )

    useHoveredCell(hoveredCellHandler)

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
                background: "ligthblue",
                borderRadius: "4px",
            }}
        >
            ...
        </button>
    )
}

export default TableCellMenu
