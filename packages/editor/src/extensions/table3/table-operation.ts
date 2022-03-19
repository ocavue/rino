/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Selection } from "prosemirror-state"
import { CellSelection, TableMap } from "prosemirror-tables"
import { EditorView } from "prosemirror-view"

import { findTable } from "./table-utils"

function getCellIndex(map: TableMap, rowIndex: number, colIndex: number): number {
    return map.width * rowIndex + colIndex
}

function validateTable(view: EditorView) {
    const table = findTable(view.state.selection)
    if (!table) {
        return null
    }

    const map = TableMap.get(table.node)
    if (map.map.length === 0) {
        return null
    }

    return { map, pos: table.pos }
}

export function selectRow(view: EditorView, index: number) {
    const table = validateTable(view)
    if (!table) {
        return
    }

    const cellIndex = getCellIndex(table.map, index, 0)
    let tr = view.state.tr
    const posInTable = table.map.map[cellIndex] // TODO why +1?
    const pos = table.pos + 1 + posInTable
    const $pos = tr.doc.resolve(pos)
    const selection = CellSelection.rowSelection($pos)
    tr = tr.setSelection(selection as unknown as Selection)
    view.dispatch(tr)
}

export function selectColumn(view: EditorView, index: number) {
    const table = validateTable(view)
    if (!table) {
        return
    }

    const cellIndex = getCellIndex(table.map, 0, index)
    let tr = view.state.tr
    const posInTable = table.map.map[cellIndex]
    const pos = table.pos + 1 + posInTable
    const $pos = tr.doc.resolve(pos)
    const selection = CellSelection.colSelection($pos)
    tr = tr.setSelection(selection as unknown as Selection)
    view.dispatch(tr)
}

export function selectTable(view: EditorView) {
    const table = validateTable(view)
    if (!table) {
        return
    }

    let tr = view.state.tr
    const firstCellPosInTable = table.map.map[0]
    const lastCellPosInTable = table.map.map.at(-1)!
    const firstCellPos = table.pos + 1 + firstCellPosInTable
    const lastCellPos = table.pos + 1 + lastCellPosInTable
    const $firstCellPos = tr.doc.resolve(firstCellPos)
    const $lastCellPos = tr.doc.resolve(lastCellPos)
    const selection = new CellSelection($firstCellPos, $lastCellPos)
    tr = tr.setSelection(selection as unknown as Selection)
    view.dispatch(tr)
}
