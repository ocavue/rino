import { TextExtension } from "@remirror/extension-text"
import Token from "markdown-it/lib/token"

import { ParserRuleType } from "src/editor/transform/parser-type"
import { NodeSerializerOptions } from "src/editor/transform/serializer"

export class RinoTextExtension extends TextExtension {
    fromMarkdown() {
        return [
            {
                type: ParserRuleType.text,
                token: "text",
                getText: (tok: Token) => tok.content,
            },
            {
                type: ParserRuleType.text,
                token: "inline",
                getText: (tok: Token) => tok.content,
            },
            {
                type: ParserRuleType.text,
                token: "softbreak",
                getText: (tok: Token) => "\n",
            },
        ] as const
    }

    toMarkdown({ state, node }: NodeSerializerOptions) {
        state.text(node.text || "")
    }
}
