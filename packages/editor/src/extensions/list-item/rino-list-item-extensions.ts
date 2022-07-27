import type Token from "markdown-it/lib/token"

import type { MarkdownParseState, NodeSerializerOptions } from "../../transform"
import { ParserRuleType } from "../../transform"
import type { MarkdownNodeExtension } from "../markdown-node/markdown-node-extension"
import { ItemAttributes, OrderedListItemExtension } from "./ordered-list-item-extension"

export class RinoOrderedListItemExtension extends OrderedListItemExtension implements MarkdownNodeExtension {
    public fromMarkdown() {
        return [
            {
                type: ParserRuleType.free,
                token: "list_item_open",
                handler: (state: MarkdownParseState, tok: Token): void => {
                    switch (state.topContext()) {
                        case "ordered_list":
                            state.openNode(this.type, { kind: "ordered" })
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
            {
                type: ParserRuleType.context,
                token: "bullet_list",
                context: "bullet_list",
            },
            {
                type: ParserRuleType.context,
                token: "ordered_list",
                context: "ordered_list",
            },
        ] as const
    }

    public toMarkdown({ state, node }: NodeSerializerOptions) {
        const attrs = node.attrs as ItemAttributes
        let firstDelim = ""
        if (attrs.kind === "ordered") {
            firstDelim = "1. "
        } else if (attrs.kind === "task") {
            firstDelim = attrs.checked ? "- [x] " : "- [ ] "
        } else if (attrs.kind === "bullet") {
            firstDelim = "- "
        }

        state.wrapBlock(" ".repeat(firstDelim.length), firstDelim, node, () => state.renderContent(node))
    }
}
