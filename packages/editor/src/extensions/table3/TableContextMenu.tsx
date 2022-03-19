import { css } from "@emotion/css"
import { CellSelection } from "@remirror/pm/tables"
import { useCommands, useRemirrorContext } from "@remirror/react-core"
import React from "react"

const TableRowMenu: React.FC = () => {
    const commands = useCommands()

    return (
        <>
            <button onMouseDown={(event) => event.preventDefault()} onClick={() => commands.addTableRowBefore()}>
                add a row before the current one
            </button>
            <button onMouseDown={(event) => event.preventDefault()} onClick={() => commands.addTableRowAfter()}>
                add a row after the current one
            </button>
        </>
    )
}

const TableMenuOptions: React.FC<{ selection: CellSelection }> = ({ selection }) => {
    const isColSelection = selection.isColSelection()
    const isRowSelection = selection.isRowSelection()

    if (isColSelection && isRowSelection) {
        return <p>table</p>
    } else if (isColSelection) {
        return <p>col</p>
    } else if (isRowSelection) {
        return <TableRowMenu />
    } else {
        return <p>cell</p>
    }
}

export function TableContextMenu(): JSX.Element | null {
    const { view } = useRemirrorContext({ autoUpdate: true })
    const selection = view.state.selection

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
                bottom: 0;
                width: 100px;
                height: 100px;
                background: lightcoral;
                z-index: 100;
            `}
        >
            <TableMenuOptions selection={selection} />
        </div>
    )
}
