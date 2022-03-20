import { css } from "@emotion/css"
import { CellSelection } from "@remirror/pm/tables"
import { useCommands, useRemirrorContext } from "@remirror/react-core"
import React from "react"

import { getTableSelectorMeta } from "./table-selector-transaction"

const TableRowMenuOptions: React.FC = () => {
    const commands = useCommands()

    return (
        <>
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
        </>
    )
}

const TableBodyMenuOptions: React.FC = () => {
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
            <button onMouseDown={(event) => event.preventDefault()} onClick={() => commands.deleteTable()}>
                delete table
            </button>
        </>
    )
}

const TableMenuOptions: React.FC<{ selection: CellSelection }> = ({ selection }) => {
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

function useSelectorEvent() {
    useRemirrorContext(({ tr }) => {
        if (tr) {
            const meta = getTableSelectorMeta(tr)
            if (meta) {
                console.log("[useSelectorEvent] meta:", meta)
            }
        }
    })
}

export function TableContextMenu(): JSX.Element | null {
    const { view } = useRemirrorContext({ autoUpdate: true })
    const selection = view.state.selection

    useSelectorEvent()

    if (!(selection instanceof CellSelection)) {
        return null
    }

    return (
        <div
            className={css`
                position: absolute;
                display: flex;
                flex-direction: column;
                top: 0;
                left: 0;
                background: lightcoral;
                z-index: 100;
                padding: 8px;
            `}
        >
            <TableMenuOptions selection={selection} />
        </div>
    )
}
