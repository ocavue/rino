import { findParentNodeOfType, FindProsemirrorNodeResult, NodeWithPosition } from "@remirror/core"
import { EditorState, ResolvedPos, Selection } from "@remirror/pm"
import { TableMap } from "@remirror/pm/tables"

export function findTable(selection: EditorState | Selection | ResolvedPos) {
    return findParentNodeOfType({ selection, types: "table" })
}

function findCellsInReat(
    table: FindProsemirrorNodeResult,
    map: TableMap,
    rect: {
        top?: number
        bottom?: number
        left?: number
        right?: number
    },
): NodeWithPosition[] {
    const { top = 0, bottom = map.height, left = 0, right = map.width } = rect
    const cellPositions = map.cellsInRect({ top, bottom, left, right })
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
    const map = TableMap.get(table.node)
    if (columnIndex < 0 || columnIndex >= map.width) return []
    return findCellsInReat(table, map, { left: columnIndex, right: columnIndex + 1 })
}

export function getCellsInRow(selection: Selection, rowIndex: number): NodeWithPosition[] {
    const table = findTable(selection)
    if (!table) return []
    const map = TableMap.get(table.node)
    if (rowIndex < 0 || rowIndex >= map.height) return []
    return findCellsInReat(table, map, { top: rowIndex, bottom: rowIndex + 1 })
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
