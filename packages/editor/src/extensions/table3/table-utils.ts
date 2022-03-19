import { clamp, findParentNodeOfType, FindProsemirrorNodeResult, NodeWithPosition } from "@remirror/core"
import { Selection } from "@remirror/pm"
import { TableMap } from "@remirror/pm/tables"

function findTable(selection: Selection) {
    return findParentNodeOfType({ selection, types: "table" })
}

function findCellsInReat(
    table: FindProsemirrorNodeResult,
    rect: {
        top?: number
        bottom?: number
        left?: number
        right?: number
    },
): NodeWithPosition[] {
    const map = TableMap.get(table.node)
    const cellPositions = map.cellsInRect({
        top: clamp({ min: 0, max: map.height, value: rect.top ?? 0 }),
        bottom: clamp({ min: 0, max: map.height, value: rect.bottom ?? map.height }),
        left: clamp({ min: 0, max: map.width, value: rect.left ?? 0 }),
        right: clamp({ min: 0, max: map.width, value: rect.right ?? map.width }),
    })
    return cellPositions.map((cellPos) => {
        const node = table.node.nodeAt(cellPos)
        const pos = cellPos + table.start
        if (!node) throw new RangeError(`unable to find a table cell node at position ${pos}`)
        return { node, pos }
    })
}

export function getCellsInColumn(selection: Selection, columnIndex: number): NodeWithPosition[] {
    const table = findTable(selection)
    if (!table) return []
    return findCellsInReat(table, { left: columnIndex, right: columnIndex + 1 })
}

export function getCellsInRow(selection: Selection, rowIndex: number): NodeWithPosition[] {
    const table = findTable(selection)
    if (!table) return []
    return findCellsInReat(table, { top: rowIndex, bottom: rowIndex + 1 })
}

