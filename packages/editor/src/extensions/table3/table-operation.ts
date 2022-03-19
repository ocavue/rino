import { findParentNodeOfType } from "@remirror/core"
import { CellSelection, TableMap } from "prosemirror-tables"
import { EditorView } from "prosemirror-view"

export function selectRow(view: EditorView, pos: number) {
    const cell = findParentNodeOfType({ selection: view.state.doc.resolve(pos), types: "tableCell" })

    if (!cell) {
        return
    }

    const tr = view.state.tr
    const selection = CellSelection.rowSelection(tr.doc.resolve(cell.pos))
    // @ts-expect-error CellSelection has incorrect type
    view.dispatch(tr.setSelection(selection))
}

export function selectColumn(view: EditorView, pos: number) {
    const cell = findParentNodeOfType({ selection: view.state.doc.resolve(pos), types: "tableCell" })

    if (!cell) {
        return
    }

    const tr = view.state.tr
    const selection = CellSelection.colSelection(tr.doc.resolve(cell.pos))
    // @ts-expect-error CellSelection has incorrect type
    view.dispatch(tr.setSelection(selection))
}

export function selectTable(view: EditorView, pos: number) {
    const table = findParentNodeOfType({ selection: view.state.doc.resolve(pos), types: "table" })

    if (!table) {
        return
    }

    const map = TableMap.get(table.node)

    if (!map.map.length) {
        return
    }

    const firstCellPos = map.map[0]
    const lastCellPos = map.map[map.map.length - 1]

    const tr = view.state.tr
    const selection = CellSelection.create(tr.doc, table.start + firstCellPos, table.start + lastCellPos)
    // @ts-expect-error CellSelection has incorrect type
    view.dispatch(tr.setSelection(selection))
}
