import { injectGlobal as css } from "@emotion/css"
import { cx } from "@remirror/core"
import { EditorState } from "@remirror/pm"
import { isCellSelection, TableMap } from "@remirror/pm/tables"
import { Decoration, DecorationSet, EditorView, WidgetDecorationSpec } from "@remirror/pm/view"

import { DATA_TABLE_SELECTOR_TYPE } from "./table-const"
import { selectColumn, selectRow, selectTable } from "./table-helpers"
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

        .remirror-table-row-selector {
            position: absolute;
            width: 16px;
            top: 0;
            bottom: 0;
            left: -17px;
        }

        .remirror-table-column-selector {
            position: absolute;
            height: 16px;
            left: 0;
            right: 0;
            top: -17px;
        }
    }
`

const preventDefaultMouseEventHandler = (event: MouseEvent) => {
    event.preventDefault()
}

function createBodySelector(view: EditorView, getPos: () => number, highlight: boolean): HTMLElement {
    return h("div", {
        class: cx("remirror-table-body-selector remirror-table-selector", highlight && "remirror-table-selector-highlight"),
        contenteditable: "false",
        [DATA_TABLE_SELECTOR_TYPE]: "true",
        onmousedown: preventDefaultMouseEventHandler,
        onmouseup: preventDefaultMouseEventHandler,
        onclick: (event) => {
            event.preventDefault()
            const pos = getPos()
            const tr = view.state.tr
            if (selectTable(tr, pos)) {
                view.dispatch(tr)
            }
        },
    })
}

function createRowSelector(view: EditorView, getPos: () => number, highlight: boolean): HTMLElement {
    return h("div", {
        class: cx("remirror-table-row-selector remirror-table-selector", highlight && "remirror-table-selector-highlight"),
        contenteditable: "false",
        [DATA_TABLE_SELECTOR_TYPE]: "true",
        onmousedown: preventDefaultMouseEventHandler,
        onmouseup: preventDefaultMouseEventHandler,
        onclick: (event) => {
            event.preventDefault()
            const pos = getPos()
            const tr = view.state.tr
            if (selectRow(tr, pos)) {
                view.dispatch(tr)
            }
        },
    })
}

function createColumnSelector(view: EditorView, getPos: () => number, highlight: boolean): HTMLElement {
    return h("div", {
        class: cx("remirror-table-column-selector remirror-table-selector", highlight && "remirror-table-selector-highlight"),
        contenteditable: "false",
        [DATA_TABLE_SELECTOR_TYPE]: "true",
        onmousedown: preventDefaultMouseEventHandler,
        onmouseup: preventDefaultMouseEventHandler,
        onclick: (event) => {
            event.preventDefault()
            const pos = getPos()
            const tr = view.state.tr
            if (selectColumn(tr, pos)) {
                view.dispatch(tr)
            }
        },
    })
}

export function createSelectorDecorations(state: EditorState): DecorationSet {
    const { doc, selection } = state

    const table = findTable(selection)

    if (!table) {
        return DecorationSet.empty
    }

    const map = TableMap.get(table.node)

    if (!map.map.length) {
        return DecorationSet.empty
    }

    const decos: Decoration[] = []

    const selectionType = isCellSelection(selection) ? getCellSelectionType(selection) : null

    let minHighlightRow = -1
    let maxHighlightRow = -1
    let minHighlightCol = -1
    let maxHighlightCol = -1

    if (isCellSelection(selection)) {
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
        decos.push(Decoration.widget(cell.pos + 1, (view, getPos) => createRowSelector(view, getPos, highlight), spec))
    })

    getCellsInRow(selection, 0).forEach((cell, colIndex) => {
        const highlight = colIndex >= minHighlightCol && colIndex <= maxHighlightCol
        decos.push(Decoration.widget(cell.pos + 1, (view, getPos) => createColumnSelector(view, getPos, highlight), spec))
    })

    return DecorationSet.create(doc, decos)
}
