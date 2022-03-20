import { autoUpdate, shift, useFloating } from "@floating-ui/react-dom"
import { CellSelection } from "@remirror/pm/tables"
import { useCommands, useRemirrorContext } from "@remirror/react-core"
import React, { useCallback, useEffect } from "react"

import { ClickSelectorHandler, useSelectorEvent } from "./use-selector-event"

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

export function TableContextMenu(): JSX.Element | null {
    const [showMenu, setShowMenu] = React.useState(false)
    const { view } = useRemirrorContext({ autoUpdate: true })
    const selection = view.state.selection

    const { x, y, reference, floating, strategy, refs, update } = useFloating({
        placement: "right",
        middleware: [shift()],
    })

    console.log("[TableContextMenu]", { x, y })

    const clickSelectorHandler: ClickSelectorHandler = useCallback(
        (type, event) => {
            const selector = event.target as HTMLElement

            console.log("[TableContextMenu] getBoundingClientRect", selector.getBoundingClientRect())

            console.log("clickSelectorHandler")
            setShowMenu(true)
            reference(selector)
        },
        [reference],
    )

    useSelectorEvent(clickSelectorHandler)

    // if (!(selection instanceof CellSelection)) {
    //     if (showMenu) {
    //         setShowMenu(false)
    //     }
    // }

    useEffect(() => {
        if (!refs.reference.current || !refs.floating.current) {
            return
        }

        // Only call this when the floating element is rendered
        return autoUpdate(refs.reference.current, refs.floating.current, update)
    }, [refs.floating, refs.reference, update])

    if (!showMenu) return null

    return (
        <div
            ref={floating}
            style={{
                zIndex: 10000,
                position: strategy,
                top: y ?? "",
                left: x ?? "",
                // display: showMenu ? "block" : "none",
            }}
        >
            Tooltip
        </div>
    )

    // return (
    //     <div
    //         className={css`
    //             position: absolute;
    //             display: flex;
    //             flex-direction: column;
    //             top: 0;
    //             left: 0;
    //             background: lightcoral;
    //             z-index: 100;
    //             padding: 8px;
    //         `}
    //     >
    //         <TableMenuOptions selection={selection} />
    //     </div>
    // )
}
