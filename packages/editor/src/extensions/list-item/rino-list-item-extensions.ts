import type Token from "markdown-it/lib/token"

import type { MarkdownParseState, NodeSerializerOptions } from "../../transform"
import { ParserRuleType } from "../../transform"
import type { MarkdownNodeExtension } from "../markdown-node/markdown-node-extension"
import { OrderedListItemExtension } from "./ordered-list-item-extension"

export class RinoOrderedListItemExtension extends OrderedListItemExtension implements MarkdownNodeExtension {
    public fromMarkdown() {
        return [
            {
                type: ParserRuleType.free,
                token: "list_item_open",
                handler: (state: MarkdownParseState, tok: Token): void => {
                    switch (state.topContext()) {
                        case "ordered_list":
                            state.openNode(this.type)
                            break
                        case "bullet_list":
                            state.openNode(this.type) // TODO: I should use bullet list type instead of `this.type` here
                            break
                        default:
                            throw new Error("unknown context")
                    }
                },
            },
            {
                type: ParserRuleType.free,
                token: "list_item_close",
                handler: (state: MarkdownParseState, tok: Token): void => {
                    state.closeNode()
                },
            },
        ] as const
    }

    public toMarkdown({ state, node }: NodeSerializerOptions) {
        state.renderContent(node)
    }
}
