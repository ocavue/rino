import { CellSelection, isCellSelection } from "@remirror/pm/tables"
import { useCommands, useEditorView } from "@remirror/react-core"
import React from "react"

import { getCellSelectionType } from "./table-utils"
import { useTableMenu, UseTableMenuProps } from "./use-table-menu"

const TableMenuOption: React.FC<{ text: string; onClick: () => void }> = ({ text, onClick }) => {
    return (
        <button onMouseDown={(event) => event.preventDefault()} onClick={onClick}>
            {text}
        </button>
    )
}

const TableMenuOptions: React.FC<{ selection: CellSelection }> = ({ selection }) => {
    const type = getCellSelectionType(selection)
    const commands = useCommands()

    return (
        <>
            {type === "row" || type === "cell" ? (
                <TableMenuOption text="Insert Above" onClick={() => commands.addTableRowBefore()} />
            ) : null}

            {type === "row" || type === "cell" ? <TableMenuOption text="Insert Below" onClick={() => commands.addTableRowAfter()} /> : null}

            {type === "column" || type === "cell" ? (
                <TableMenuOption text="Insert Left" onClick={() => commands.addTableColumnBefore()} />
            ) : null}

            {type === "column" || type === "cell" ? (
                <TableMenuOption text="Insert Right" onClick={() => commands.addTableColumnAfter()} />
            ) : null}

            {type === "table" ? <TableMenuOption text="Delete" onClick={() => commands.deleteTable()} /> : null}

            {type === "row" ? <TableMenuOption text="Delete" onClick={() => commands.deleteTableRow()} /> : null}

            {type === "column" ? <TableMenuOption text="Delete" onClick={() => commands.deleteTableColumn()} /> : null}

            <TableMenuOption text="Highlight" onClick={() => commands.setTableCellBackground("yellow")} />

            <TableMenuOption text="Clear style" onClick={() => commands.setTableCellBackground(null)} />
        </>
    )
}

type TableMenuProps = UseTableMenuProps

export const TableMenu: React.FC<TableMenuProps> = ({ event, handleClose }) => {
    const selection = useEditorView().state.selection

    const { floating, strategy, x, y } = useTableMenu({ event, handleClose })
    const open = Boolean(event) ?? x ?? y

    return open && isCellSelection(selection) ? (
        <div
            ref={floating}
            style={{
                zIndex: 12,
                position: strategy,
                top: y ?? "",
                left: x ?? "",

                display: "flex",
                flexDirection: "column",
                maxWidth: "calc(100vw - 16px)",
                padding: "8px",
                borderRadius: "4px",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: "rgba(0, 0, 0, 0.1)",
                background: "#fff",
            }}
        >
            <TableMenuOptions selection={selection} />
        </div>
    ) : null
}
