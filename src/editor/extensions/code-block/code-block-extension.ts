import { ExtensionManagerNodeTypeParams, KeyBindings } from "@remirror/core"
import {
    codeBlockDefaultOptions,
    CodeBlockExtension,
    CodeBlockExtensionOptions,
    getLanguage,
} from "@remirror/extension-code-block"
import Token from "markdown-it/lib/token"

import { InlineDecorateType } from "src/editor/extensions/inline"
import { ParserTokenType } from "src/editor/transform/parser-type"
import { NodeSerializerOptions } from "src/editor/transform/serializer"
import { buildBlockEnterKeymapBindings, MarkdownNodeExtension } from "src/editor/utils"

import { supportedLanguages } from "./code-block-languages"

export const defaultRinoCodeBlockExtensionOptions = {
    ...codeBlockDefaultOptions,
    supportedLanguages: supportedLanguages,
    defaultLanguage: "",
    extraAttrs: [
        { name: "userInputLanguage", default: "" },
        { name: "inlineDecorateType", default: InlineDecorateType.Ignore },
        { name: "codeBlockType", default: "fenced" },
    ],
}

export class RinoCodeBlockExtension extends CodeBlockExtension
    implements MarkdownNodeExtension<CodeBlockExtensionOptions> {
    get defaultOptions() {
        return { ...defaultRinoCodeBlockExtensionOptions }
    }

    public keys(params: ExtensionManagerNodeTypeParams): KeyBindings {
        return {
            ...super.keys(params),
            ...buildBlockEnterKeymapBindings(/^```([a-zA-Z]*)?$/, ({ match }) => {
                const userInputLanguage = match[1] || ""
                return params.type.create({
                    language: getLanguage({
                        language: userInputLanguage,
                        fallback: this.options.defaultLanguage,
                        supportedLanguages: this.options.supportedLanguages,
                    }),
                    userInputLanguage,
                })
            }),
        }
    }

    // Override the default input rules from remirror
    public inputRules() {
        return []
    }

    public fromMarkdown() {
        return [
            {
                // https://spec.commonmark.org/0.29/#fenced-code-blocks
                type: ParserTokenType.block,
                token: "fence",
                node: this.name,
                hasOpenClose: false,
                getAttrs: (tok: Token) => {
                    const userInputLanguage = tok.info
                    return {
                        language: getLanguage({
                            language: userInputLanguage,
                            fallback: defaultRinoCodeBlockExtensionOptions.defaultLanguage,
                            supportedLanguages:
                                defaultRinoCodeBlockExtensionOptions.supportedLanguages,
                        }),
                        userInputLanguage,
                        codeBlockType: "fenced",
                    }
                },
            },
            {
                // https://spec.commonmark.org/0.29/#indented-code-block
                type: ParserTokenType.block,
                token: "code_block",
                node: this.name,
                hasOpenClose: false,
                getAttrs: (tok: Token) => {
                    return {
                        language: "",
                        userInputLanguage: "",
                        codeBlockType: "indented",
                    }
                },
            },
        ] as const
    }

    public toMarkdown({ state, node }: NodeSerializerOptions) {
        if (node.attrs.codeBlockType === "fenced") {
            state.write("```" + ((node.attrs.userInputLanguage as string) || "") + "\n")
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
