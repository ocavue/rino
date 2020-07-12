import { CodeBlockExtension, CodeBlockOptions, getLanguage } from "@remirror/extension-code-block"
import Token from "markdown-it/lib/token"
import { DefaultExtensionOptions } from "remirror/core"

import { InlineDecorateType } from "src/editor/extensions"
import { ParserRuleType } from "src/editor/transform/parser-type"
import { NodeSerializerOptions } from "src/editor/transform/serializer"
import { buildBlockEnterKeymapBindings } from "src/editor/utils"

import { supportedLanguages } from "./code-block-languages"

export class RinoCodeBlockExtension extends CodeBlockExtension {
    static readonly defaultOptions: DefaultExtensionOptions<CodeBlockOptions> = {
        ...CodeBlockExtension.defaultOptions,
        supportedLanguages: supportedLanguages,
        extraAttributes: {
            userInputLanguage: {
                default: "",
            },
            inlineDecorateType: {
                default: InlineDecorateType.Ignore,
            },
            codeBlockType: {
                default: "fenced",
            },
        },
    }

    createKeymap = () => {
        return {
            ...super.createKeymap(),
            ...buildBlockEnterKeymapBindings(/^```([a-zA-Z]*)?$/, ({ match }) => {
                const userInputLanguage = match[1] || ""
                return this.type.create({
                    language: getLanguage({
                        language: userInputLanguage,
                        fallback: this.options.defaultLanguage,
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
                type: ParserRuleType.block,
                token: "fence",
                node: this.name,
                hasOpenClose: false,
                getAttrs: (tok: Token) => {
                    const userInputLanguage = tok.info
                    return {
                        language: getLanguage({
                            language: userInputLanguage,
                            fallback: this.options.defaultLanguage,
                        }),
                        userInputLanguage,
                        codeBlockType: "fenced",
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
