import { ExtensionManagerNodeTypeParams, KeyBindings } from "@remirror/core"
import {
    codeBlockDefaultOptions,
    CodeBlockExtension,
    CodeBlockExtensionOptions,
    getLanguage,
} from "@remirror/extension-code-block"
import Token from "markdown-it/lib/token"

import { InlineDecorateType } from "src/editor/extensions/decoration"
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
                    }
                },
            },
        ] as const
    }

    public toMarkdown({ state, node }: NodeSerializerOptions) {
        state.write("```" + (node.attrs.userInputLanguage || "") + "\n")
        state.text(node.textContent, false)
        state.ensureNewLine()
        state.write("```")
        state.closeBlock(node)
    }
}
