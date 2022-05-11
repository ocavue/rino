import { NodeWithPosition } from "@remirror/core"
import { renderEditor } from "jest-remirror"
import { range } from "lodash-es"
import { TextSelection } from "prosemirror-state"
import { expect, test } from "vitest"

import {
    RinoParagraphExtension,
    RinoTableCellExtension,
    RinoTableExtension,
    RinoTableHeaderCellExtension,
    RinoTableRowExtension,
    RinoTextExtension,
} from ".."
import { getCellsInColumn, getCellsInRow } from "./table-utils"

const setup = () => {
    const editor = renderEditor([
        new RinoParagraphExtension(),
        new RinoTextExtension(),
        new RinoTableExtension(),
        new RinoTableRowExtension(),
        new RinoTableCellExtension(),
        new RinoTableHeaderCellExtension(),
    ])
    const {
        view,
        add,
        nodes: { doc, p, table, tableRow, tableCell },
        manager,
        schema,
    } = editor

    const buildTable = (size: { rows: number; cols: number }) => {
        const rows = range(size.rows).map((rowIndex) => {
            const cells = range(size.cols).map((colIndex) => {
                return tableCell(`r${rowIndex}c${colIndex}`)
            })
            return tableRow(cells)
        })
        return table(rows)
    }

    return {
        manager,
        view,
        schema,
        add,
        doc,
        p,
        table,
        tableRow,
        tableCell,
        buildTable,
    }
}

function formatCells(cells: NodeWithPosition[]) {
    return cells.map((cell) => cell.node.textContent)
}

test("getCellsInColumn", () => {
    const { buildTable, add, doc, view } = setup()
    add(doc(buildTable({ rows: 2, cols: 3 })))
    const selection = TextSelection.near(view.state.doc.resolve(1))

    expect(formatCells(getCellsInColumn(selection, 0))).toEqual(["r0c0", "r1c0"])
    expect(formatCells(getCellsInColumn(selection, 1))).toEqual(["r0c1", "r1c1"])
    expect(formatCells(getCellsInColumn(selection, 2))).toEqual(["r0c2", "r1c2"])
    expect(formatCells(getCellsInColumn(selection, 3))).toEqual([])
    expect(formatCells(getCellsInColumn(selection, 4))).toEqual([])
    expect(formatCells(getCellsInColumn(selection, -1))).toEqual([])
    expect(formatCells(getCellsInColumn(selection, -2))).toEqual([])
})

test("getCellsInRow", () => {
    const { buildTable, add, doc, view } = setup()
    add(doc(buildTable({ rows: 2, cols: 3 })))
    const selection = TextSelection.near(view.state.doc.resolve(1))

    expect(formatCells(getCellsInRow(selection, 0))).toEqual(["r0c0", "r0c1", "r0c2"])
    expect(formatCells(getCellsInRow(selection, 1))).toEqual(["r1c0", "r1c1", "r1c2"])
    expect(formatCells(getCellsInRow(selection, 2))).toEqual([])
    expect(formatCells(getCellsInRow(selection, 3))).toEqual([])
    expect(formatCells(getCellsInRow(selection, -1))).toEqual([])
    expect(formatCells(getCellsInRow(selection, -2))).toEqual([])
})
