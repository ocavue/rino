import { injectGlobal as css } from "@emotion/css"
import { cx } from "@remirror/core"
import { EditorState, ProsemirrorNode } from "@remirror/pm"
import { CellSelection, TableMap } from "@remirror/pm/tables"
import { Decoration, DecorationSet, EditorView, WidgetDecorationSpec } from "@remirror/pm/view"

import { TABLE_SELECTOR_DATA_TAG_COLUMN } from "./table-const"
import { selectColumn, selectRow, selectTable } from "./table-operation"
import { setTableSelectorMeta } from "./table-selector-transaction"
import {
    createElement as h,
    findTable,
    getCellSelectionRect,
    getCellSelectionType,
    getCellsInColumn,
    getCellsInRect,
    getCellsInRow,
} from "./table-utils"

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
                background-color: #c6c6c6;
            }
        }

        .remirror-table-selector-highlight {
            background-color: #bbd5ef;

            &:hover {
                background-color: #91bbe5;
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

function createBodySelector(view: EditorView, getPos: () => number, highlight: boolean): HTMLElement {
    return h("div", {
        class: cx("remirror-table-body-selector remirror-table-selector", highlight && "remirror-table-selector-highlight"),
        contenteditable: "false",
        // onmousedown: (event) => {
        //     event.preventDefault()
        //     const pos = getPos()
        //     const tr = setTableSelectorMeta(view.state.tr, { type: "mousedown", selectionType: "table", pos })
        //     if (selectTable(tr, pos)) {
        //         view.dispatch(tr)
        //     }
        // },
        // onmouseup: (event) => {
        //     event.preventDefault()
        //     const pos = getPos()
        //     const tr = setTableSelectorMeta(view.state.tr, { type: "mouseup", selectionType: "table", pos, event })
        //     view.dispatch(tr)
        // },
    })
}

function createRowSelector(view: EditorView, getPos: () => number, highlight: boolean, rowIndex: number): HTMLElement {
    return h("div", {
        class: cx("remirror-table-row-selector remirror-table-selector", highlight && "remirror-table-selector-highlight"),
        contenteditable: "false",
        // onmousedown: (event) => {
        //     event.preventDefault()
        //     const pos = getPos()
        //     const tr = setTableSelectorMeta(view.state.tr, { type: "mousedown", selectionType: "row", pos })
        //     if (selectRow(tr, pos)) {
        //         view.dispatch(tr)
        //     }
        // },
        onmouseup: (event) => {
            event.preventDefault()
            // event.stopPropagation()
            //     const pos = getPos()
            //     const tr = setTableSelectorMeta(view.state.tr, { type: "mouseup", selectionType: "row", pos, event })
            //     view.dispatch(tr)
        },
        onclick: (event) => {
            event.preventDefault()
            // event.stopPropagation()
            //     const pos = getPos()
            //     const tr = setTableSelectorMeta(view.state.tr, { type: "mouseup", selectionType: "row", pos, event })
            //     view.dispatch(tr)

            const pos = getPos()
            const tr = setTableSelectorMeta(view.state.tr, { type: "mousedown", selectionType: "row", pos })
            if (selectRow(tr, pos)) {
                view.dispatch(tr)
            }
        },
    })
}

function createColumnSelector(view: EditorView, getPos: () => number, highlight: boolean, colIndex: number): HTMLElement {
    console.log("createColumnSelector")

    return h("div", {
        class: cx("remirror-table-column-selector remirror-table-selector", highlight && "remirror-table-selector-highlight"),
        contenteditable: "false",
        [TABLE_SELECTOR_DATA_TAG_COLUMN]: "true",
        onmousedown: (event) => {
            event.preventDefault()
            // const pos = getPos()
            // const tr = setTableSelectorMeta(view.state.tr, { type: "mousedown", selectionType: "column", pos })
            // if (selectColumn(tr, getPos())) {
            //     view.dispatch(tr)
            // }
        },
        onmouseup: (event) => {
            event.preventDefault()
            // const pos = getPos()
            // const tr = setTableSelectorMeta(view.state.tr, { type: "mouseup", selectionType: "column", pos, event })

            // const rect = (event.target as HTMLElement).getBoundingClientRect()
            // console.log("[column-selector] getBoundingClientRect", rect)

            // view.dispatch(tr)
        },
        onclick: (event) => {
            console.log("[ColumnSelector] onclick")
            event.preventDefault()

            //     const pos = getPos()

            //     console.log("[ColumnSelector] event getBoundingClientRect", (event.target as HTMLElement).getBoundingClientRect())
            //     const tr = setTableSelectorMeta(view.state.tr, { type: "click", selectionType: "column", event })
            //     console.log("[ColumnSelector] dispatch start")
            //     view.dispatch(tr)
            //     console.log("[ColumnSelector] dispatch end")
            //     console.log("[ColumnSelector] event getBoundingClientRect", (event.target as HTMLElement).getBoundingClientRect())

            //     // setTimeout(() => {
            //     //     const tr = view.state.tr
            //     //     if (selectColumn(tr, getPos())) {
            //     //         view.dispatch(tr)
            //     //     }
            //     // }, 0)
        },
    })
}

const decoCache = new WeakMap<ProsemirrorNode, DecorationSet>()

export function createSelectorDecorations(state: EditorState, _view: EditorView): DecorationSet {
    const { doc, selection } = state

    const table = findTable(selection)

    if (!table) {
        return DecorationSet.empty
    }

    // if (decoCache.has(table.node)) {
    //     return decoCache.get(table.node)!
    // }

    const map = TableMap.get(table.node)

    if (!map.map.length) {
        return DecorationSet.empty
    }

    const decos: Decoration[] = []

    const selectionType = selection instanceof CellSelection ? getCellSelectionType(selection) : null

    let minHighlightRow = -1
    let maxHighlightRow = -1
    let minHighlightCol = -1
    let maxHighlightCol = -1

    if (selection instanceof CellSelection) {
        if (selectionType === "table") {
            minHighlightRow = 0
            maxHighlightRow = map.height - 1
            minHighlightCol = 0
            maxHighlightCol = map.width - 1
        } else if (selectionType === "row") {
            const rect = getCellSelectionRect(selection)
            minHighlightRow = rect.top
            maxHighlightRow = rect.bottom - 1
        } else if (selectionType === "column") {
            const rect = getCellSelectionRect(selection)
            minHighlightCol = rect.left
            maxHighlightCol = rect.right - 1
        }
    }

    const spec: WidgetDecorationSpec = {
        side: -1,
        ignoreSelection: true,
    }

    const cornerCell = getCellsInRect(selection, { top: 0, bottom: 1, left: 0, right: 1 })[0]

    decos.push(Decoration.widget(cornerCell.pos + 1, (view, getPos) => createBodySelector(view, getPos, selectionType === "table"), spec))

    getCellsInColumn(selection, 0).forEach((cell, rowIndex) => {
        const highlight = rowIndex >= minHighlightRow && rowIndex <= maxHighlightRow
        decos.push(Decoration.widget(cell.pos + 1, (view, getPos) => createRowSelector(view, getPos, highlight, rowIndex), spec))
    })

    getCellsInRow(selection, 0).forEach((cell, colIndex) => {
        const highlight = colIndex >= minHighlightCol && colIndex <= maxHighlightCol
        // const getPos = () => cell.pos + 1
        // const view = _view
        decos.push(
            Decoration.widget(cell.pos + 1, (view, getPos) => createColumnSelector(view, getPos, highlight, colIndex), {
                ...spec,
                // key: `column-selector-${colIndex}`,
            }),
        )
    })

    const decorationSet = DecorationSet.create(doc, decos)
    // decoCache.set(table.node, decorationSet)
    return decorationSet
}
