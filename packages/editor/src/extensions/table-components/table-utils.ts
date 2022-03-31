import { findParentNodeOfType, FindProsemirrorNodeResult, NodeWithPosition } from "@remirror/core"
import { EditorState, ResolvedPos, Selection } from "@remirror/pm"
import { CellSelection, Rect, TableMap } from "@remirror/pm/tables"

export function findTable(selection: EditorState | Selection | ResolvedPos) {
    return findParentNodeOfType({ selection, types: "table" })
}

function findCellsInReat(
    table: FindProsemirrorNodeResult,
    map: TableMap,
    rect: { top: number; bottom: number; left: number; right: number },
): NodeWithPosition[] {
    return map.cellsInRect(rect).map((cellPos) => {
        const node = table.node.nodeAt(cellPos)
        const pos = cellPos + table.start
        if (!node) throw new RangeError(`unable to find a table cell node at position ${pos}`)
        return { node, pos }
    })
}

export function getCellsInColumn(selection: EditorState | Selection | ResolvedPos, columnIndex: number): NodeWithPosition[] {
    const table = findTable(selection)
    if (!table) return []
    const map = TableMap.get(table.node)
    if (columnIndex < 0 || columnIndex >= map.width) return []
    return findCellsInReat(table, map, { top: 0, bottom: map.height, left: columnIndex, right: columnIndex + 1 })
}

export function getCellsInRow(selection: EditorState | Selection | ResolvedPos, rowIndex: number): NodeWithPosition[] {
    const table = findTable(selection)
    if (!table) return []
    const map = TableMap.get(table.node)
    if (rowIndex < 0 || rowIndex >= map.height) return []
    return findCellsInReat(table, map, { top: rowIndex, bottom: rowIndex + 1, left: 0, right: map.width })
}

export function getCellsInRect(
    selection: Selection,
    rect: { top: number; bottom: number; left: number; right: number },
): NodeWithPosition[] {
    const table = findTable(selection)
    if (!table) return []
    const map = TableMap.get(table.node)
    return findCellsInReat(table, map, rect)
}

type ElementEventHandlers = Partial<
    Omit<GlobalEventHandlers, "addEventListener" | "addEventListener" | "removeEventListener" | "removeEventListener">
>
type ElementAttributes = ElementEventHandlers | Record<string, string>

export function createElement<TagName extends keyof HTMLElementTagNameMap>(
    tagName: TagName,
    attributes?: ElementAttributes | null,
    ...children: Array<HTMLElement | string>
) {
    const element = document.createElement(tagName)
    if (attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
            if (typeof value === "string") {
                element.setAttribute(key, value)
            } else {
                element[key as keyof ElementEventHandlers] = value
            }
        })
    }
    children.forEach((child) => {
        element.append(child)
    })
    return element
}

/**
 * All available cell selection type.
 *
 * @remarks
 *
 * - "table": This selection includes all cells in the table.
 * - "row": This selection goes all the way from the left to the right of the table.
 * - "column": This selection goes all the way from the top to the bottom of the table.
 * - "cell": This selection is neither any of the above. *
 */
export type CellSelectionType = "table" | "row" | "column" | "cell"

const cellSelectionTypeCache = new WeakMap<CellSelection, CellSelectionType>()

/**
 * Returns the type of the cell selection if it is a cell selection.
 */
export function getCellSelectionType(selection: CellSelection): CellSelectionType {
    let type = cellSelectionTypeCache.get(selection)
    if (!type) {
        type = calcCellSelectionType(selection)
        cellSelectionTypeCache.set(selection, type)
    }
    return type
}

function calcCellSelectionType(selection: CellSelection): CellSelectionType {
    const isColSelection = selection.isColSelection()
    const isRowSelection = selection.isRowSelection()

    if (isColSelection && isRowSelection) {
        return "table"
    } else if (isColSelection) {
        return "column"
    } else if (isRowSelection) {
        return "row"
    } else {
        return "cell"
    }
}

export function getCellSelectionRect(selection: CellSelection): Rect {
    const table = selection.$anchorCell.node(-1)
    const map = TableMap.get(table)
    const start = selection.$anchorCell.start(-1)
    return map.rectBetween(selection.$anchorCell.pos - start, selection.$headCell.pos - start)
}
