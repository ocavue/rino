import { findParentNodeOfType } from "@remirror/core"
import { CellSelection, TableMap } from "prosemirror-tables"
import { EditorView } from "prosemirror-view"

function validateTable(view: EditorView, pos: number) {
    const $pos = view.state.doc.resolve(pos)
    const table = findParentNodeOfType({ selection: $pos, types: "table" })
    const cell = findParentNodeOfType({ selection: $pos, types: "tableCell" })

    if (!table || !cell) {
        return null
    }

    const map = TableMap.get(table.node)
    if (map.map.length === 0) {
        return null
    }

    return { map, tableStart: table.start, cellPos: cell.pos }
}

export function selectRow(view: EditorView, pos: number) {
    const details = validateTable(view, pos)

    if (!details) {
        return
    }

    const tr = view.state.tr
    const selection = CellSelection.rowSelection(tr.doc.resolve(details.cellPos))
    // @ts-expect-error CellSelection has incorrect type
    view.dispatch(tr.setSelection(selection))
}

export function selectColumn(view: EditorView, pos: number) {
    const details = validateTable(view, pos)

    if (!details) {
        return
    }

    const tr = view.state.tr
    const selection = CellSelection.colSelection(tr.doc.resolve(pos))
    // @ts-expect-error CellSelection has incorrect type
    view.dispatch(tr.setSelection(selection))
}

export function selectTable(view: EditorView, pos: number) {
    const details = validateTable(view, pos)

    if (!details) {
        return
    }

    const { map, tableStart } = details
    const tr = view.state.tr
    const firstCellPosInTable = map.map[0]
    const lastCellPosInTable = map.map[map.map.length - 1]
    const selection = CellSelection.create(tr.doc, tableStart + firstCellPosInTable, tableStart + lastCellPosInTable)
    // @ts-expect-error CellSelection has incorrect type
    view.dispatch(tr.setSelection(selection))
}
