import { NodeRange, NodeType, ResolvedPos } from "@remirror/pm/model"
import { NodeSelection, Selection } from "@remirror/pm/state"

export function isBlockNodeSelection(selection: Selection): boolean {
    return (selection as NodeSelection).node && (selection as NodeSelection).node.type.isBlock
}

export function isLastChild($pos: ResolvedPos, depth: number): boolean {
    return $pos.node(depth).childCount == $pos.indexAfter(depth)
}

export function isListItemType(type: NodeType): boolean {
    // TODO: use remirror tag instead of node name
    return ["orderedListItem"].includes(type.name)
}

function isItemRange(range: NodeRange, itemType: NodeType): boolean {
    const { startIndex, endIndex, parent } = range
    let childrenAreItems = true
    for (let i = startIndex; i < endIndex; i++) {
        if (parent.child(i).type !== itemType) {
            childrenAreItems = false
            break
        }
    }
    return childrenAreItems
}

/**
 * Returns a minimal range that represents one or multiple sibling list items
 * and includes the given two positions.
 */
export function findItemRange($from: ResolvedPos, $to: ResolvedPos, itemType: NodeType): NodeRange | null {
    if ($to.pos < $from.pos) {
        return findItemRange($to, $from, itemType)
    }

    let range = $from.blockRange($to)

    while (range) {
        if (isItemRange(range, itemType)) {
            return range
        }

        if (range.depth <= 0) {
            break
        }

        range = new NodeRange($from, $to, range.depth - 1)
    }

    return null
}

export function findIndentationRange($from: ResolvedPos, $to: ResolvedPos, itemType: NodeType): NodeRange | null {
    const itemRange = findItemRange($from, $to, itemType)

    // If mutiple items are selected, or the selection is inside the first child of the selected list item, then we
    // lift the item range. Otherwise, we lift the parent block.
    if (itemRange) {
        const itemCount = itemRange.endIndex - itemRange.startIndex
        if (itemCount > 1 || ($from.depth > itemRange.depth && $from.index(itemRange.depth + 1) === 0)) {
            return itemRange
        }
    }

    return $from.blockRange($to)
}

export function isItemRangeForIndentation(itemRange: NodeRange) {
    const itemCount = itemRange.endIndex - itemRange.startIndex
    if (itemCount > 1) return true

    const { $from, depth } = itemRange

    return $from.depth > depth && $from.index(depth + 1) === 0
}
