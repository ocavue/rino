import { ProsemirrorNode } from "@remirror/pm"
import { NodeType, ResolvedPos } from "prosemirror-model"
import { NodeSelection, Selection } from "prosemirror-state"

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

export function createNearSelection(selection: Selection, doc: ProsemirrorNode, pos: number): Selection {
    return (selection.constructor as typeof Selection).near(doc.resolve(pos))
}
