import { TextExtension } from "@remirror/extension-text"
import Token from "markdown-it/lib/token"

import { NodeSerializerOptions, ParserRuleType } from "../../transform"

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
