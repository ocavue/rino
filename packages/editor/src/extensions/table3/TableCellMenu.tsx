import { useFloating } from "@floating-ui/react-dom"
import { TableSchemaSpec } from "@remirror/extension-tables"
import { NodeType } from "@remirror/pm"
import { useCommands, useEditorView, useHover, useRemirrorContext } from "@remirror/react"
import React, { useCallback, useEffect, useState } from "react"

import { useContextMenuFloating } from "./use-context-menu-floating"

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

const TableCellMenuOptions: React.FC = () => {
    const commands = useCommands()

    return (
        <>
            <button onMouseDown={(event) => event.preventDefault()} onClick={() => commands.addTableRowBefore()}>
                add a row before the current one
            </button>
            <button onMouseDown={(event) => event.preventDefault()} onClick={() => commands.addTableRowAfter()}>
                add a row after the current one
            </button>
            <button onMouseDown={(event) => event.preventDefault()} onClick={() => commands.addTableColumnBefore()}>
                add a column before the current one
            </button>
            <button onMouseDown={(event) => event.preventDefault()} onClick={() => commands.addTableColumnAfter()}>
                add a column after the current one
            </button>

            <button onMouseDown={(event) => event.preventDefault()} onClick={() => commands.setTableCellBackground("red")}>
                Set cell to red
            </button>
            <button onMouseDown={(event) => event.preventDefault()} onClick={() => commands.setTableCellBackground("green")}>
                Set cell to green
            </button>
            <button onMouseDown={(event) => event.preventDefault()} onClick={() => commands.setTableCellBackground(null)}>
                Clear cell style
            </button>
        </>
    )
}

const TableCellMenu: React.FC = () => {
    const { showMenu, x, y, floating, strategy } = useButtonFloating()

    const menuFloating = useContextMenuFloating()

    return (
        <>
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
                onClick={menuFloating.clickHandler}
            >
                ...
            </button>
            <div
                ref={menuFloating.floating}
                style={{
                    display: menuFloating.show ? "flex" : "none",
                    flexDirection: "column",
                    zIndex: 10000,
                    position: menuFloating.strategy,
                    top: menuFloating.y ?? "",
                    left: menuFloating.x ?? "",
                    background: "lightgreen",
                    borderRadius: "4px",
                    padding: "8px",
                }}
            >
                <TableCellMenuOptions />
            </div>
        </>
    )
}

export default TableCellMenu
