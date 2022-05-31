import { PlainExtension } from "@remirror/core"
import { EditorState } from "@remirror/pm/state"
import { DecorationSet } from "@remirror/pm/view"

import { createSelectorDecorations } from "./table-selector"

export class TableSelectorExtension extends PlainExtension {
    get name() {
        return "tableSelector"
    }

    createDecorations(state: EditorState): DecorationSet {
        return createSelectorDecorations(state)
    }
}
