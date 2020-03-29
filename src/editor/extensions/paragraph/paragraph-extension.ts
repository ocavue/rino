import { ParagraphExtension } from "@remirror/core-extensions"
import { ParagraphExtensionOptions } from "@remirror/core-extensions/lib/nodes/paragraph/paragraph-types"

import { ParserTokenType } from "src/editor/transform/parser-type"
import { NodeSerializerOptions } from "src/editor/transform/serializer"
import { MarkdownNodeExtension } from "src/editor/utils"

export class RinoParagraphExtension extends ParagraphExtension
    implements MarkdownNodeExtension<ParagraphExtensionOptions> {
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
