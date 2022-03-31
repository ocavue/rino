import { Strategy } from "@floating-ui/react-dom"
import { useCommands } from "@remirror/react"
import React from "react"

import { TableContextMenuV3 } from "./TableContextMenu"

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
    const [event, setEvent] = React.useState<React.MouseEvent | null>(null)

    const handleClick = (event: React.MouseEvent) => {
        setEvent(event)
    }

    const handleClose = () => {
        setEvent(null)
    }

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
                onClick={handleClick}
            >
                ...
            </button>
            <TableContextMenuV3 handleClose={handleClose} event={event} />
        </>
    )
}
