import { TextExtension } from "@remirror/core"
import Token from "markdown-it/lib/token"

import { ParserTokenType } from "src/editor/transform/parser-type"
import { NodeSerializerOptions } from "src/editor/transform/serializer"

export class RinoTextExtension extends TextExtension {
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

    toMarkdown({ state, node }: NodeSerializerOptions) {
        state.text(node.text || "")
    }
}
