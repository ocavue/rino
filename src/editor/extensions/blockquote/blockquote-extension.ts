import { BlockquoteExtension } from "@remirror/core-extensions"

import { ParserTokenType } from "src/editor/transform/parser-type"
import { NodeSerializerOptions } from "src/editor/transform/serializer"

export class RinoBlockquoteExtension extends BlockquoteExtension {
    public styles() {
        return ""
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
