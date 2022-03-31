import { useFloating } from "@floating-ui/react-dom"
import { TableSchemaSpec } from "@remirror/extension-tables"
import { NodeType } from "@remirror/pm"
import { useEditorView, useHover, useRemirrorContext } from "@remirror/react"
import React, { useCallback, useEffect, useState } from "react"

import { TableMenuButton } from "./TableMenuButton"

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

    const { view } = useRemirrorContext({ autoUpdate: true })

    const dom = useHoverCell()

    useEffect(() => {
        hoveredCellHandler(dom)
    }, [dom, hoveredCellHandler, update, view.state])

    return { showMenu, x, y, refs, floating, strategy }
}

export const TableCellMenu: React.FC = () => {
    const { showMenu, x, y, floating, strategy } = useButtonFloating()
    return showMenu ? <TableMenuButton x={x} y={y} floating={floating} strategy={strategy} /> : null
}
