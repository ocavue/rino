import { KeyBindings, NodeType } from "@remirror/core"

import { createDedentListCommand, createSplitListCommand } from "./list-item-commands"

export function createListItemKeymap(itemType: NodeType): KeyBindings {
    return {
        Enter: createSplitListCommand(itemType),

        "Shift-Tab": createDedentListCommand(itemType),
    }
}
