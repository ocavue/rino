import { MarkdownNodeExtension } from "src/editor/utils"
import { ParagraphExtension } from "@remirror/core-extensions"
import { ParagraphExtensionOptions } from "@remirror/core-extensions/lib/nodes/paragraph/paragraph-types"
import { ParserTokenType } from "src/editor/transform/parser-type"
import Token from "markdown-it/lib/token"

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
            {
                type: ParserTokenType.text,
                token: "text",
                getText: (tok: Token) => tok.content,
            },
            {
                type: ParserTokenType.text,
                token: "inline",
                getText: (tok: Token) => tok.content,
            },
            {
                type: ParserTokenType.text,
                token: "softbreak",
                getText: (tok: Token) => "\n",
            },
        ] as const
    }
}
