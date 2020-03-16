import { HorizontalRuleExtension } from "@remirror/core-extensions"
import { MarkdownNodeExtension } from "src/editor/utils"
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
}
