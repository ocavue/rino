import { ParagraphExtension } from "@remirror/core-extensions"

import { ParserTokenType } from "src/editor/transform/parser-type"
import { NodeSerializerOptions } from "src/editor/transform/serializer"

export class RinoParagraphExtension extends ParagraphExtension {
    fromMarkdown() {
        return [
            {
                type: ParserTokenType.block,
                token: "paragraph",
                node: this.name,
                hasOpenClose: true,
            },
        ] as const
    }

    toMarkdown({ state, node }: NodeSerializerOptions) {
        state.renderInline(node)
        state.closeBlock(node)
    }
}
