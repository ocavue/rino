import { isString, ProsemirrorNode } from "@remirror/core"
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
                            state.openNode(this.type, { kind: "ordered" } satisfies ListAttributes)
                            break
                        case "bullet_list":
                            state.openNode(this.type, { kind: "bullet" } satisfies ListAttributes)
                            break
                        default:
                            throw new Error("unknown context")
                    }
                },
            },
            {
                type: ParserRuleType.free,
                token: "list_checkbox",
                handler: (state: MarkdownParseState, tok: Token) => {
                    const parent = state.stack[state.stack.length - 1]
                    if (parent?.type.name === "list") {
                        const checked: null | string | boolean = tok.attrGet("checked")
                        const attrs: ListAttributes = { kind: "task", checked: isString(checked) || !!checked }
                        parent.attrs = attrs
                    } else {
                        console.warn(`expect list but got ${parent?.type.name}`)
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

    public toMarkdown({ state, node, counter }: NodeSerializerOptions) {
        const attrs = node.attrs as ListAttributes
        let firstDelim = ""
        if (attrs.kind === "ordered") {
            firstDelim = `${counter}. `
        } else if (attrs.kind === "task") {
            firstDelim = attrs.checked ? "- [x] " : "- [ ] "
        } else if (attrs.kind === "bullet") {
            firstDelim = "- "
        }

        state.wrapBlock(" ".repeat(firstDelim.length), firstDelim, node, () => state.renderContent(node))
    }
}

export function isOrderedListNode(node: ProsemirrorNode): boolean {
    return node.type.name === "list" && (node.attrs as ListAttributes).kind === "ordered"
}
