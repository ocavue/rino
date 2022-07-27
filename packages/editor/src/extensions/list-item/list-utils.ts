import { ProsemirrorNode } from "@remirror/pm"
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

export function isListItemNode(node?: ProsemirrorNode | null): node is ProsemirrorNode {
    if (node) {
        return isListItemType(node.type)
    }
    return false
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
 * Returns a minimal block range that includes the given two positions and
 * represents one or multiple sibling list items.
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
    const range = findItemRange($from, $to, itemType)

    // If the range is not inside a list item, then we do nothing for its indentation.
    if (!range) {
        return null
    }

    // If mutiple items are selected, then we lift/sink the item range.
    if (range.endIndex - range.startIndex > 1) {
        return range
    }

    // Otherwise, we only lift/sink the block range inside the item.
    return new NodeRange($from, $to, range.depth + 1)
}

export function isItemRangeForIndentation(itemRange: NodeRange) {
    const itemCount = itemRange.endIndex - itemRange.startIndex
    if (itemCount > 1) return true

    const { $from, depth } = itemRange

    return $from.depth > depth && $from.index(depth + 1) === 0
}
