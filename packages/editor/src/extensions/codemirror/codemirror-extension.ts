import { CodeMirrorExtension } from "@remirror/extension-codemirror6"
import Token from "markdown-it/lib/token"

import { NodeSerializerOptions, ParserRuleType } from "../../transform"

/** Use this fake language name to mark a code block as an indented code block instead of a fence code block */
const FAKE_INDENTED_LANGUAGE = "rino-indented"

export class RinoCodeMirrorExtension extends CodeMirrorExtension {
    public fromMarkdown() {
        return [
            {
                // https://spec.commonmark.org/0.29/#fenced-code-blocks
                type: ParserRuleType.block,
                token: "fence",
                node: this.name,
                hasOpenClose: false,
                getAttrs: (tok: Token) => {
                    const language = tok.info
                    return {
                        language,
                    }
                },
            },
            {
                // https://spec.commonmark.org/0.29/#indented-code-block
                type: ParserRuleType.block,
                token: "code_block",
                node: this.name,
                hasOpenClose: false,
                getAttrs: (tok: Token) => {
                    return {
                        language: FAKE_INDENTED_LANGUAGE,
                    }
                },
            },
        ] as const
    }

    public toMarkdown({ state, node }: NodeSerializerOptions) {
        if (node.attrs.codeBlockType !== FAKE_INDENTED_LANGUAGE) {
            state.write("```" + ((node.attrs.language as string) || "") + "\n")
            state.text(node.textContent, false)
            state.text("\n")
            state.write("```")
            state.closeBlock(node)
        } else {
            state.wrapBlock("    ", "    ", node, () => state.renderContent(node))
            state.closeBlock(node)
        }
        state.ensureNewLine()
    }
}
