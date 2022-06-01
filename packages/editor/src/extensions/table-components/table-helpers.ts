import { findParentNodeOfType } from "@remirror/core"
import { Transaction } from "@remirror/pm/state"
import { CellSelection, TableMap } from "@remirror/pm/tables"

export function selectRow(tr: Transaction, pos: number): boolean {
    const cell = findParentNodeOfType({ selection: tr.doc.resolve(pos), types: "tableCell" })

    if (!cell) {
        return false
    }

    const selection = CellSelection.rowSelection(tr.doc.resolve(cell.pos))
    // @ts-expect-error CellSelection has incorrect type
    tr.setSelection(selection)
    return true
}

export function selectColumn(tr: Transaction, pos: number): boolean {
    const cell = findParentNodeOfType({ selection: tr.doc.resolve(pos), types: "tableCell" })

    if (!cell) {
        return false
    }

    const selection = CellSelection.colSelection(tr.doc.resolve(cell.pos))
    // @ts-expect-error CellSelection has incorrect type
    tr.setSelection(selection)
    return true
}

export function selectTable(tr: Transaction, pos: number): boolean {
    const table = findParentNodeOfType({ selection: tr.doc.resolve(pos), types: "table" })

    if (!table) {
        return false
    }

    const map = TableMap.get(table.node)

    if (!map.map.length) {
        return false
    }

    const firstCellPos = map.map[0]
    const lastCellPos = map.map[map.map.length - 1]

    const selection = CellSelection.create(tr.doc, table.start + firstCellPos, table.start + lastCellPos)
    // @ts-expect-error CellSelection has incorrect type
    tr.setSelection(selection)
    return true
}

export function selectCell(tr: Transaction, pos: number): boolean {
    const selection = CellSelection.create(tr.doc, pos)
    // @ts-expect-error CellSelection has incorrect type
    tr.setSelection(selection)
    return true
}
