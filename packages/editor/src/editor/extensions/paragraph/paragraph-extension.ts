import { ParagraphExtension } from "@remirror/extension-paragraph"

import { ParserRuleType } from "src/editor/transform/parser-type"
import { NodeSerializerOptions } from "src/editor/transform/serializer"

export class RinoParagraphExtension extends ParagraphExtension {
    fromMarkdown() {
        return [
            {
                type: ParserRuleType.block,
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
