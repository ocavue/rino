import { BlockquoteExtension } from "@remirror/core-extensions"
import { MarkdownNodeExtension } from "../utils"
import { NodeSerializerOptions } from "../transform/serializer"
import { ParserTokenType } from "../transform/parser-type"

export class RinoBlockquoteExtension extends BlockquoteExtension implements MarkdownNodeExtension {
    public styles() {
        return ``
    }
    public fromMarkdown() {
        return [
            {
                type: ParserTokenType.block,
                token: "blockquote",
                node: this.name,
                hasOpenClose: true,
            },
        ] as const
    }
    public toMarkdown({ state, node }: NodeSerializerOptions) {
        state.wrapBlock("> ", null, node, () => state.renderContent(node))
    }
}
