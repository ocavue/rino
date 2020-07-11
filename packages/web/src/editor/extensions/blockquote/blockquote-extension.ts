import { BlockquoteExtension } from "@remirror/extension-blockquote"

import { ParserRuleType } from "src/editor/transform/parser-type"
import { NodeSerializerOptions } from "src/editor/transform/serializer"

export class RinoBlockquoteExtension extends BlockquoteExtension {
    public fromMarkdown() {
        return [
            {
                type: ParserRuleType.block,
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
