import { EditorState, Selection } from "prosemirror-state"
import { Decoration, DecorationSet } from "prosemirror-view"

import { createElement as h, getCellsInColumn, getCellsInRect, getCellsInRow } from "./table-utils"

function createTableSelector(selection: Selection): Decoration | null {
    const cell = getCellsInRect(selection, { top: 0, bottom: 1, left: 0, right: 1 }).at(0)
    if (!cell) {
        return null
    }

    return Decoration.widget(cell.pos + 1, (view, getPos) => {
        return h("div", { style: "background: red;" }, "table selector")
    })
}

function createRowSelectors(selection: Selection): Decoration[] {
    return getCellsInColumn(selection, 0).map((cell, rowIndex) => {
        return Decoration.widget(cell.pos + 1, (view, getPos) => {
            return h("div", { style: "background: green;" }, `row selector ${rowIndex}`)
        })
    })
}

function createColumnSelectors(selection: Selection): Decoration[] {
    return getCellsInRow(selection, 0).map((cell, columnIndex) => {
        return Decoration.widget(cell.pos + 1, (view, getPos) => {
            return h("div", { style: "background: yellow;" }, `column selector ${columnIndex}`)
        })
    })
}

export function createSelectors(state: EditorState): DecorationSet {
    const { doc, selection } = state

    const tableSelector = createTableSelector(selection)
    if (!tableSelector) return DecorationSet.empty

    const rowSelectors = createRowSelectors(selection)
    const columnSelectors = createColumnSelectors(selection)

    return DecorationSet.create(doc, [tableSelector, ...rowSelectors, ...columnSelectors])
}
