import { Strategy } from "@floating-ui/react-dom"
import { useCommands } from "@remirror/react"
import React from "react"

import { useContextMenuFloating } from "./use-context-menu-floating"

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

type TableMenuButtonProps = {
    x: number | null
    y: number | null
    floating: (node: HTMLElement | null) => void
    strategy: Strategy
}

export const TableMenuButton: React.FC<TableMenuButtonProps> = ({ x, y, floating, strategy }) => {
    const menuFloating = useContextMenuFloating()

    return (
        <>
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
