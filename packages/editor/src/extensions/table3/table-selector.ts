import { EditorState, Selection } from "prosemirror-state"
import { Decoration, DecorationSet } from "prosemirror-view"

import { injectGlobalStyles } from "./table-selector-style"
import { createElement as h, getCellsInColumn, getCellsInRect, getCellsInRow } from "./table-utils"

injectGlobalStyles()

function createBodySelector(selection: Selection): Decoration | null {
    const cell = getCellsInRect(selection, { top: 0, bottom: 1, left: 0, right: 1 }).at(0)
    if (cell) {
        return Decoration.widget(
            cell.pos + 1,
            (view, getPos) => {
                return h("div", { class: "remirror-table-body-selector remirror-table-selector", contenteditable: "false" })
            },
            { side: -1 },
        )
    }
    return null
}

function createRowSelectors(selection: Selection): Decoration[] {
    return getCellsInColumn(selection, 0).map((cell, rowIndex) => {
        return Decoration.widget(
            cell.pos + 1,
            (view, getPos) => {
                return h("div", { class: "remirror-table-row-selector remirror-table-selector", contenteditable: "false" })
            },
            { side: -1 },
        )
    })
}

function createColumnSelectors(selection: Selection): Decoration[] {
    return getCellsInRow(selection, 0).map((cell, columnIndex) => {
        return Decoration.widget(
            cell.pos + 1,
            (view, getPos) => {
                return h("div", { class: "remirror-table-column-selector remirror-table-selector", contenteditable: "false" })
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
