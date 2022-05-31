import { findParentNodeOfType } from "@remirror/core"
import { CodeMirrorExtension } from "@remirror/extension-codemirror6"
import { EditorState } from "@remirror/pm/state"
import { Decoration, DecorationSet } from "@remirror/pm/view"
import Token from "markdown-it/lib/token"

import { ENABLE_REACT_CODE_LANGUAGE_SELECTOR } from "../../components/flags"
import { NodeSerializerOptions, ParserRuleType } from "../../transform"
import { fakeIndentedLanguage } from "./codemirror-const"
import { setupLanguageMenu } from "./codemirror-language-menu"

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
                        language: fakeIndentedLanguage,
                    }
                },
            },
        ] as const
    }

    public toMarkdown({ state, node }: NodeSerializerOptions) {
        if (node.attrs.language !== fakeIndentedLanguage) {
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

    createDecorations(state: EditorState): DecorationSet {
        if (ENABLE_REACT_CODE_LANGUAGE_SELECTOR) {
            return DecorationSet.empty
        }

        const languages = this.options.languages?.length ?? 0
        if (languages <= 1) {
            return DecorationSet.empty
        }

        const found = findParentNodeOfType({ types: this.type, selection: state.selection })
        if (!found) {
            return DecorationSet.empty
        }

        const [createLanguageMenu, destroyLanguageMenu] = setupLanguageMenu(found.node)

        const deco = Decoration.widget(found.pos, createLanguageMenu, {
            ignoreSelection: true,
            stopEvent: () => true,
            key: "language-menu",
            destroy: destroyLanguageMenu,
        })
        return DecorationSet.create(state.doc, [deco])
    }
}
