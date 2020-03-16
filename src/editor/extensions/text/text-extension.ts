import { MarkdownNodeExtension } from "src/editor/utils"
import { ParserTokenType } from "src/editor/transform/parser-type"
import { TextExtension } from "@remirror/core"
import { ToMarkdownOptions } from "src/editor/transform/serializer"
import Token from "markdown-it/lib/token"

export class RinoTextExtension extends TextExtension implements MarkdownNodeExtension {
    fromMarkdown() {
        return [
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

    toMarkdown({ state, node }: ToMarkdownOptions) {
        state.text(node.text || "")
    }
}
