import { autoUpdate, offset, shift, useFloating } from "@floating-ui/react-dom"
import { Selection } from "@remirror/core"
import { isCellSelection } from "@remirror/pm/tables"
import { useCommands, useRemirrorContext } from "@remirror/react-core"
import React, { useCallback, useEffect, useLayoutEffect } from "react"

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

const TableMenuOptions: React.FC<{ selection: Selection }> = ({ selection }) => {
    if (!isCellSelection(selection)) {
        return null
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
    const [showMenu, setShowMenu] = React.useState(false)
    const { view } = useRemirrorContext({ autoUpdate: true })
    const selection = view.state.selection

    const { x, y, reference, floating, strategy, refs, update } = useFloating({
        placement: "right-start",
        middleware: [
            shift({
                mainAxis: true,
                crossAxis: true,
            }),
        ],
    })

    console.log("[TableContextMenu]", { x, y, showMenu })

    const clickSelectorHandler: ClickSelectorHandler = useCallback(
        (type, event) => {
            const selector = event.target as HTMLElement

            console.log("[TableContextMenu] getBoundingClientRect", selector.getBoundingClientRect())

            console.log("clickSelectorHandler")
            setShowMenu(true)

            const { clientX, clientY } = event
            const virtualEl = {
                getBoundingClientRect() {
                    return {
                        width: 0,
                        height: 0,
                        x: clientX,
                        y: clientY,
                        top: clientY,
                        left: clientX,
                        right: clientX,
                        bottom: clientY,
                    }
                },
                contextElement: selector,
            }

            reference(virtualEl)
        },
        [reference],
    )

    useSelectorEvent(clickSelectorHandler)

    useEffect(() => {
        if (!refs.reference.current || !refs.floating.current) {
            return
        }

        // Only call this when the floating element is rendered
        return autoUpdate(refs.reference.current, refs.floating.current, update)
    }, [refs.floating, refs.reference, update])

    // if (!showMenu) return null

    if (!isCellSelection(selection)) {
        if (showMenu) {
            setShowMenu(false)
        }
        // return null
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
                display: showMenu ? "flex" : "none",
                flexDirection: "column",
                width: "240px",
                maxWidth: "calc(100vw - 16px)",
                borderRadius: "4px",
            }}
        >
            <TableMenuOptions selection={selection} />
        </div>
    )
}
