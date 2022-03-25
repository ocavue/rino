import { useFloating } from "@floating-ui/react-dom"
import { NodeWithPosition } from "@remirror/core"
import { TableSchemaSpec } from "@remirror/extension-tables"
import { NodeType } from "@remirror/pm"
import { isCellSelection } from "@remirror/pm/tables"
import { useEditorView, useEvent, useRemirrorContext } from "@remirror/react"
import React, { useEffect, useMemo } from "react"

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

function useHoveredCell() {
    const [cellNode, setCellNode] = React.useState<NodeWithPosition | null>(null)

    useEvent("hover", (props) => {
        console.log(
            "hover-event",
            props.nodes.map((n) => n.node.type),
        )
        console.log(
            "hover-event",
            props.nodes.map((n) => isCellType(n.node.type)),
        )

        for (const nodeWithPos of props.nodes) {
            if (isCellType(nodeWithPos.node.type)) {
                setCellNode(nodeWithPos)
            }
        }
    })

    return cellNode
}

function useHoveredCellDom() {
    const view = useEditorView()
    const cellNode = useHoveredCell()

    console.log("cellNode:", cellNode)

    if (!cellNode) {
        return null
    }

    const dom = view.nodeDOM(cellNode.pos)
    if (!dom) {
        return null
    }

    return dom as HTMLElement
}

function useButtonFloating() {
    const dom = useHoveredCellDom()

    const { x, y, reference, floating, strategy, refs } = useFloating({
        placement: "bottom-end",
        middleware: [],
    })

    const rect = dom?.getBoundingClientRect() || null
    const hasRect = !!rect

    const virtualRect = useMemo(() => {
        return hasRect
            ? {
                  width: rect.width,
                  height: 0,
                  x: rect.x,
                  y: rect.y,
                  top: rect.top,
                  left: rect.left,
                  right: rect.right,
                  bottom: rect.top,
              }
            : null
    }, [hasRect, rect?.left, rect?.right, rect?.top, rect?.width, rect?.x, rect?.y])

    useEffect(() => {
        if (!virtualRect) return

        const virtualEl = {
            getBoundingClientRect() {
                return virtualRect
            },
            contextElement: dom,
        }
        reference(virtualEl)
    }, [dom, reference, virtualRect])

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
