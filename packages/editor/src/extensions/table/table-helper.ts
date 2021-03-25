/* Copyright (c) 2020-present ocavue@gmail.com */

import { Node as ProsemirrorNode } from "prosemirror-model"
import { EditorState } from "prosemirror-state"

export function selectedTableCell(state: EditorState): ProsemirrorNode | null {
    const fromCell: ProsemirrorNode = state.selection.$from.parent
    const toCell: ProsemirrorNode = state.selection.$to.parent

    if (fromCell.type.name === "tableCell" && toCell.type.name === "tableCell" && fromCell === toCell) {
        return fromCell
    }

    return null
}
