import { isCellSelection } from "@remirror/pm/tables"
import { useCommands, useRemirrorContext } from "@remirror/react-core"
import React from "react"

import { useContextMenuFloating, UseFloatingReturn } from "./use-context-menu-floating"

const TableRowMenuOptions: React.FC = () => {
    const commands = useCommands()

    return (
        <>
            <button onMouseDown={(event) => event.preventDefault()} onClick={() => commands.setTableCellBackground("red")}>
                Set cell to red
            </button>
            <button onMouseDown={(event) => event.preventDefault()} onClick={() => commands.setTableCellBackground("green")}>
                Set cell to green
            </button>
            <button onMouseDown={(event) => event.preventDefault()} onClick={() => commands.setTableCellBackground(null)}>
                Clear cell style
            </button>

            <button onMouseDown={(event) => event.preventDefault()} onClick={() => commands.addTableRowBefore()}>
                add a row before the current one
            </button>
            <button onMouseDown={(event) => event.preventDefault()} onClick={() => commands.addTableRowAfter()}>
                add a row after the current one
            </button>
            <button onMouseDown={(event) => event.preventDefault()} onClick={() => commands.deleteTableRow()}>
                delete row
            </button>
        </>
    )
}

const TableColumnMenuOptions: React.FC = () => {
    const commands = useCommands()

    return (
        <>
            <button onMouseDown={(event) => event.preventDefault()} onClick={() => commands.addTableColumnBefore()}>
                add a column before the current one
            </button>
            <button onMouseDown={(event) => event.preventDefault()} onClick={() => commands.addTableColumnAfter()}>
                add a column after the current one
            </button>
            <button onMouseDown={(event) => event.preventDefault()} onClick={() => commands.deleteTableColumn()}>
                delete column
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

const TableBodyMenuOptions: React.FC = () => {
    const commands = useCommands()

    return (
        <>
            <button onMouseDown={(event) => event.preventDefault()} onClick={() => commands.setTableCellBackground("red")}>
                Set cell to red
            </button>
            <button onMouseDown={(event) => event.preventDefault()} onClick={() => commands.setTableCellBackground("green")}>
                Set cell to green
            </button>
            <button onMouseDown={(event) => event.preventDefault()} onClick={() => commands.setTableCellBackground(null)}>
                Clear cell style
            </button>

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
            <button onMouseDown={(event) => event.preventDefault()} onClick={() => commands.deleteTable()}>
                delete table
            </button>
        </>
    )
}

const TableMenuOptions: React.FC = () => {
    const { view } = useRemirrorContext({ autoUpdate: true })
    const selection = view.state.selection

    if (!isCellSelection(selection)) {
        return <p>No CELL Selection</p>
    }

    const isColSelection = selection.isColSelection()
    const isRowSelection = selection.isRowSelection()

    if (isColSelection && isRowSelection) {
        return <TableBodyMenuOptions />
    } else if (isColSelection) {
        return <TableColumnMenuOptions />
    } else if (isRowSelection) {
        return <TableRowMenuOptions />
    } else {
        return <p>cell</p>
    }
}

export function TableContextMenu(): JSX.Element | null {
    const { x, y, floating, strategy, show } = useContextMenuFloating()

    return (
        <div
            ref={floating}
            style={{
                zIndex: 10000,
                position: strategy,
                top: y ?? "",
                left: x ?? "",
                padding: "8px",
                background: "lightcoral",
                display: show ? "flex" : "none",
                flexDirection: "column",
                width: "240px",
                maxWidth: "calc(100vw - 16px)",
                borderRadius: "4px",
            }}
        >
            <TableMenuOptions />
        </div>
    )
}

type TableContextMenuV2Props = Pick<UseFloatingReturn, "floating" | "strategy" | "x" | "y"> & { open: boolean }

export const TableContextMenuV2: React.FC<TableContextMenuV2Props> = ({ floating, strategy, x, y, open }) => {
    if (!open) {
        return null
    }

    return (
        <div
            ref={floating}
            style={{
                zIndex: 10000,
                position: strategy,
                top: y ?? "",
                left: x ?? "",
                padding: "8px",
                background: "lightcoral",
                display: "flex",
                flexDirection: "column",
                width: "240px",
                maxWidth: "calc(100vw - 16px)",
                borderRadius: "4px",
            }}
        >
            <TableMenuOptions />
        </div>
    )
}
