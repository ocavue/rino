import { CellSelection, isCellSelection } from "@remirror/pm/tables"
import { useCommands, useEditorView } from "@remirror/react-core"
import React from "react"

import { useTableMenu, UseTableMenuProps } from "./use-table-menu"

const TableMenuOption: React.FC<{ text: string; onClick: () => void }> = ({ text, onClick }) => {
    return (
        <button onMouseDown={(event) => event.preventDefault()} onClick={onClick}>
            {text}
        </button>
    )
}

const TableMenuOptions: React.FC<{ selection: CellSelection }> = ({ selection }) => {
    const isColSelection: boolean = selection.isColSelection()
    const isRowSelection: boolean = selection.isRowSelection()
    const isTableSelection: boolean = isColSelection && isRowSelection
    const isCellsSelection: boolean = !isColSelection && !isRowSelection

    const commands = useCommands()

    return (
        <>
            {isRowSelection || isCellsSelection ? (
                <TableMenuOption text="Insert Above" onClick={() => commands.addTableRowBefore()} />
            ) : null}

            {isRowSelection || isCellsSelection ? (
                <TableMenuOption text="Insert Below" onClick={() => commands.addTableRowAfter()} />
            ) : null}

            {isColSelection || isCellsSelection ? (
                <TableMenuOption text="Insert Left" onClick={() => commands.addTableColumnBefore()} />
            ) : null}

            {isColSelection || isCellsSelection ? (
                <TableMenuOption text="Insert Right" onClick={() => commands.addTableColumnAfter()} />
            ) : null}

            {isTableSelection ? <TableMenuOption text="Delete" onClick={() => commands.deleteTable()} /> : null}

            {isRowSelection ? <TableMenuOption text="Delete" onClick={() => commands.deleteTableRow()} /> : null}

            {isColSelection ? <TableMenuOption text="Delete" onClick={() => commands.deleteTableColumn()} /> : null}

            <TableMenuOption text="Highlight" onClick={() => commands.setTableCellBackground("yellow")} />

            <TableMenuOption text="Clear style" onClick={() => commands.setTableCellBackground(null)} />
        </>
    )
}

type TableMenuProps = UseTableMenuProps

export const TableMenu: React.FC<TableMenuProps> = ({ event, handleClose }) => {
    const selection = useEditorView().state.selection

    const open = Boolean(event)
    const { floating, strategy, x, y } = useTableMenu({ event, handleClose })

    return open && isCellSelection(selection) ? (
        <div
            ref={floating}
            style={{
                zIndex: 12,
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
            <TableMenuOptions selection={selection} />
        </div>
    ) : null
}
