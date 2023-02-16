import type Token from "markdown-it/lib/token"
import { ListAttributes, ListExtension } from "remirror-extension-flat-list"
import type { MarkdownParseState, NodeSerializerOptions } from "../../transform"
import { ParserRuleType } from "../../transform"
import type { MarkdownNodeExtension } from "../markdown-node/markdown-node-extension"

export class RinoListExtension extends ListExtension implements MarkdownNodeExtension {
    public fromMarkdown() {
        return [
            {
                type: ParserRuleType.free,
                token: "list_item_open",
                handler: (state: MarkdownParseState, tok: Token): void => {
                    switch (state.topContext()) {
                        case "ordered_list":
                            state.openNode(this.type, { type: "ordered" } satisfies ListAttributes)
                            break
                        case "bullet_list":
                            state.openNode(this.type)
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
        const attrs = node.attrs as ListAttributes
        let firstDelim = ""
        if (attrs.type === "ordered") {
            firstDelim = "1. "
        } else if (attrs.type === "task") {
            firstDelim = attrs.checked ? "- [x] " : "- [ ] "
        } else if (attrs.type === "bullet") {
            firstDelim = "- "
        }

        state.wrapBlock(" ".repeat(firstDelim.length), firstDelim, node, () => state.renderContent(node))
    }
}
