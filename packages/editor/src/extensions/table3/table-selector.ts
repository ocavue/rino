import { injectGlobal as css } from "@emotion/css"
import { EditorState, Selection } from "prosemirror-state"
import { Decoration, DecorationSet } from "prosemirror-view"

import { selectColumn, selectRow, selectTable } from "./table-operation"
import { createElement as h, getCellsInColumn, getCellsInRect, getCellsInRow } from "./table-utils"

css`
    .remirror-editor.ProseMirror .tableWrapper {
        overflow: visible;
    }

    .remirror-editor.ProseMirror table {
        overflow: visible;

        .remirror-table-selector {
            cursor: pointer;

            background-color: #e5e5e5;
            transition: background-color 0.15s ease-in-out;

            &:hover {
                transition: background-color 0.05s ease-in-out;
                background-color: #bbbbbb;
            }
        }

        .remirror-table-body-selector {
            position: absolute;
            width: 16px;
            height: 16px;
            top: -22px;
            left: -22px;
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
            left: -22px;
        }

        /* Second implementation */
        .remirror-table-column-selector {
            position: absolute;
            height: 16px;
            left: 0;
            right: 0;
            top: -22px;
        }
    }
`

function createBodySelector(selection: Selection): Decoration | null {
    const cell = getCellsInRect(selection, { top: 0, bottom: 1, left: 0, right: 1 }).at(0)
    if (cell) {
        return Decoration.widget(
            cell.pos + 1,
            (view, getPos) => {
                return h("div", {
                    class: "remirror-table-body-selector remirror-table-selector",
                    contenteditable: "false",
                    onmousedown: (event) => {
                        event.preventDefault()
                    },
                    onclick: (event) => {
                        event.preventDefault()
                        selectTable(view)
                    },
                })
            },
            { side: -1, ignoreSelection: true },
        )
    }
    return null
}

function createRowSelectors(selection: Selection): Decoration[] {
    return getCellsInColumn(selection, 0).map((cell, rowIndex) => {
        return Decoration.widget(
            cell.pos + 1,
            (view, getPos) => {
                return h("div", {
                    class: "remirror-table-row-selector remirror-table-selector",
                    contenteditable: "false",
                    onmousedown: (event) => {
                        event.preventDefault()
                    },
                    onclick: (event) => {
                        event.preventDefault()
                        selectRow(view, rowIndex)
                    },
                })
            },
            { side: -1, ignoreSelection: true },
        )
    })
}

function createColumnSelectors(selection: Selection): Decoration[] {
    return getCellsInRow(selection, 0).map((cell, columnIndex) => {
        return Decoration.widget(
            cell.pos + 1,
            (view, getPos) => {
                return h("div", {
                    class: "remirror-table-column-selector remirror-table-selector",
                    contenteditable: "false",
                    onmousedown: (event) => {
                        event.preventDefault()
                    },
                    onclick: (event) => {
                        event.preventDefault()
                        selectColumn(view, columnIndex)
                    },
                })
            },
            { side: -1, ignoreSelection: true },
        )
    })
}

export function createSelectors(state: EditorState): DecorationSet {
    const { doc, selection } = state

    const tableSelector = createBodySelector(selection)
    if (!tableSelector) return DecorationSet.empty

    const rowSelectors = createRowSelectors(selection)
    const columnSelectors = createColumnSelectors(selection)

    return DecorationSet.create(doc, [tableSelector, ...rowSelectors, ...columnSelectors])
}
