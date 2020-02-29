import { EditorState } from "prosemirror-state"
import { Node as ProsemirrorNode } from "prosemirror-model"

export function selectedTableCell(state: EditorState): ProsemirrorNode | null {
    const fromCell: ProsemirrorNode = state.selection.$from.parent
    const toCell: ProsemirrorNode = state.selection.$to.parent

    if (
        fromCell.type.name === "rinoTableCell" &&
        toCell.type.name === "rinoTableCell" &&
        fromCell === toCell
    ) {
        return fromCell
    }

    return null
}
