import { PlainExtension } from "@remirror/core"
import { EditorState } from "prosemirror-state"
import { DecorationSet } from "prosemirror-view"

import { createSelectorDecorations } from "./table-selector"

export class TableSelectorExtension extends PlainExtension {
    get name() {
        return "tableSelector"
    }

    createDecorations(state: EditorState): DecorationSet {
        return createSelectorDecorations(state)
    }
}
