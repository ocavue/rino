import { KeyBindings, NodeType } from "@remirror/core"

import { createDedentListCommand, createIndentListCommand, createSplitListCommand } from "./list-item-commands"

export function createListItemKeymap(itemType: NodeType): KeyBindings {
    return {
        Enter: createSplitListCommand(itemType),

        "Shift-Tab": createDedentListCommand(itemType),

        Tab: createIndentListCommand(itemType),
    }
}
