import { injectGlobal as css } from "@emotion/css"
import { cx } from "@remirror/core"
import { EditorState, Selection } from "prosemirror-state"
import { CellSelection, TableMap } from "prosemirror-tables"
import { Decoration, DecorationSet } from "prosemirror-view"

import { selectColumn, selectRow, selectTable } from "./table-operation"
import { createElement as h, findTable, getCellSelectionType, getCellsInColumn, getCellsInRect, getCellsInRow } from "./table-utils"

css`
    .remirror-editor.ProseMirror .tableWrapper {
        overflow: visible;
    }

    .remirror-editor.ProseMirror table {
        overflow: visible;

        .remirror-table-selector {
            cursor: pointer;

            outline-color: #c5c5c5;
            outline-style: solid;
            outline-width: 1px;

            background-color: #e5e5e5;

            &:hover {
                background-color: #bbbbbb;
            }
        }

        .remirror-table-selector-highlight {
            background-color: purple;

            &:hover {
                background-color: purple;
            }
        }

        .remirror-table-body-selector {
            position: absolute;
            width: 16px;
            height: 16px;
            top: -17px;
            left: -17px;
        }

        /* First implementation  */
        /* .remirror-table-row-selector {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                width: 0;

                &::after {
                    background-color: red;
                    cursor: pointer;
                    position: absolute;
                    width: 16px;
                    top: 0;
                    bottom: 0;
                    left: -24px;
                    display: block;
                    content: "";
                }
            } */

        .remirror-table-row-selector {
            position: absolute;
            width: 16px;
            top: 0;
            bottom: 0;
            left: -17px;
        }

        /* Second implementation */
        .remirror-table-column-selector {
            position: absolute;
            height: 16px;
            left: 0;
            right: 0;
            top: -17px;
        }
    }
`

function createBodySelector(selection: Selection, highlight: boolean): Decoration | null {
    const cell = getCellsInRect(selection, { top: 0, bottom: 1, left: 0, right: 1 }).at(0)
    if (cell) {
        return Decoration.widget(
            cell.pos + 1,
            (view, getPos) => {
                return h("div", {
                    class: cx("remirror-table-body-selector remirror-table-selector", highlight && "remirror-table-selector-highlight"),
                    contenteditable: "false",
                    onmousedown: (event) => {
                        event.preventDefault()
                    },
                    onclick: (event) => {
                        event.preventDefault()
                        selectTable(view, getPos())
                    },
                })
            },
            { side: -1, ignoreSelection: true },
        )
    }
    return null
}

function createRowSelectors(selection: Selection): Decoration[] {
    return getCellsInColumn(selection, 0).map((cell) => {
        const highlight = true

        return Decoration.widget(
            cell.pos + 1,
            (view, getPos) => {
                return h("div", {
                    class: cx("remirror-table-row-selector remirror-table-selector", highlight && "remirror-table-selector-highlight"),
                    contenteditable: "false",
                    onmousedown: (event) => {
                        event.preventDefault()
                    },
                    onclick: (event) => {
                        event.preventDefault()
                        selectRow(view, getPos())
                    },
                })
            },
            { side: -1, ignoreSelection: true },
        )
    })
}

function createColumnSelectors(selection: Selection): Decoration[] {
    return getCellsInRow(selection, 0).map((cell) => {
        const highlight = true

        return Decoration.widget(
            cell.pos + 1,
            (view, getPos) => {
                return h("div", {
                    class: cx("remirror-table-column-selector remirror-table-selector", highlight && "remirror-table-selector-highlight"),
                    contenteditable: "false",
                    onmousedown: (event) => {
                        event.preventDefault()
                    },
                    onclick: (event) => {
                        event.preventDefault()
                        selectColumn(view, getPos())
                    },
                })
            },
            { side: -1, ignoreSelection: true },
        )
    })
}

export function createSelectors(state: EditorState): DecorationSet {
    const { doc, selection } = state

    const table = findTable(selection)

    if (!table) {
        return DecorationSet.empty
    }

    const map = TableMap.get(table.node)

    if (!map.map.length) {
        return DecorationSet.empty
    }

    let minHighlightRow = -1
    let maxHighlightRow = -1
    let minHighlightCol = -1
    let maxHighlightCol = -1

    if (selection instanceof CellSelection) {
        const type = getCellSelectionType(selection)
        if (type === "table") {
            minHighlightRow = 0
            maxHighlightRow = map.height - 1
            minHighlightCol = 0
            maxHighlightCol = map.width - 1
        }
    }

    const tableSelector = createBodySelector(selection)
    if (!tableSelector) return DecorationSet.empty

    const rowSelectors = createRowSelectors(selection)
    const columnSelectors = createColumnSelectors(selection)

    return DecorationSet.create(doc, [tableSelector, ...rowSelectors, ...columnSelectors])
}
