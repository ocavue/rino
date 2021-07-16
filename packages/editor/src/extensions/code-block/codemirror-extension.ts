import "codemirror/mode/cmake/cmake"
import "codemirror/mode/css/css"
import "codemirror/mode/dart/dart"
import "codemirror/mode/diff/diff"
import "codemirror/mode/django/django"
import "codemirror/mode/dockerfile/dockerfile"
import "codemirror/mode/gfm/gfm"
import "codemirror/mode/go/go"
import "codemirror/mode/htmlmixed/htmlmixed"
import "codemirror/mode/javascript/javascript"
import "codemirror/mode/jsx/jsx"
import "codemirror/mode/markdown/markdown"
import "codemirror/mode/python/python"
import "codemirror/mode/ruby/ruby"
import "codemirror/mode/rust/rust"
import "codemirror/mode/sass/sass"
import "codemirror/mode/shell/shell"
import "codemirror/mode/sql/sql"
import "codemirror/mode/toml/toml"
import "codemirror/mode/yaml/yaml"

import { DefaultExtensionOptions, KeyBindings } from "@remirror/core"
import { CodeMirrorExtension, CodeMirrorExtensionOptions } from "@remirror/extension-codemirror5"
import Token from "markdown-it/lib/token"

import { NodeSerializerOptions, ParserRuleType } from "../../transform"
import { buildBlockEnterKeymapBindings } from "../../utils"
import { InlineDecorateType } from "../inline"

export class RinoCodeBlockExtension extends CodeMirrorExtension {
    static readonly defaultOptions: DefaultExtensionOptions<CodeMirrorExtensionOptions> = {
        defaultCodeMirrorConfig: {
            theme: "nord",
            lineWrapping: true,
            scrollbarStyle: undefined,

            // By setting an editor's `height` style to `auto` and giving the `viewportMargin` a
            // value of `Infinity`, CodeMirror can be made to automatically resize to fit its
            // content.
            // https://codemirror.net/demo/resize.html
            viewportMargin: Infinity,
        },
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
        CodeMirror: undefined,
    }

    createKeymap(): KeyBindings {
        const type = this.type

        return buildBlockEnterKeymapBindings(/^```([a-zA-Z0-9-+#]*)$/, ({ match }) => {
            const userInputLanguage = match[1] || "text/plain"
            return type.create({
                language: userInputLanguage,
                userInputLanguage,
                codeBlockType: "fenced",
            })
        })
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
                        language: userInputLanguage,
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
