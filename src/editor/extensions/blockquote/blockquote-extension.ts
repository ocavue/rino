import { BlockquoteExtension } from "@remirror/core-extensions"
import { MarkdownNodeExtension } from "src/editor/utils"
import { NodeSerializerOptions } from "src/editor/transform/serializer"
import { ParserTokenType } from "src/editor/transform/parser-type"

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
