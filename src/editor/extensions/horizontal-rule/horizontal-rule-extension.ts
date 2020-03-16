import { HorizontalRuleExtension } from "@remirror/core-extensions"
import { MarkdownNodeExtension } from "src/editor/utils"
import { NodeSerializerOptions } from "src/editor/transform/serializer"
import { ParserTokenType } from "src/editor/transform/parser-type"

export class RinoHorizontalRuleExtension extends HorizontalRuleExtension
    implements MarkdownNodeExtension {
    fromMarkdown() {
        return [
            {
                type: ParserTokenType.block,
                token: "hr",
                node: this.name,
                hasOpenClose: false,
            },
        ] as const
    }
    toMarkdown({ state, node }: NodeSerializerOptions) {
        state.write(node.attrs.markup || "---")
        state.closeBlock(node)
    }
}
