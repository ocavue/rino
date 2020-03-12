import {
    CodeBlockExtension,
    codeBlockDefaultOptions,
    getLanguage,
} from "@remirror/extension-code-block"
import { ExtensionManagerNodeTypeParams, KeyBindings } from "@remirror/core"
import { InlineDecorateType } from "src/editor/extensions/decoration"
import { MarkdownNodeExtension, buildBlockEnterKeymapBindings } from "src/editor/utils"

import clike from "refractor/lang/clike"
import css from "refractor/lang/css"
import go from "refractor/lang/go"
import java from "refractor/lang/java"
import js from "refractor/lang/javascript"
import markup from "refractor/lang/markup"
import python from "refractor/lang/python"
import typescript from "refractor/lang/typescript"

export const defaultRinoCodeBlockExtensionOptions = {
    ...codeBlockDefaultOptions,
    supportedLanguages: [java, clike, css, js, markup, python, typescript, go],
    defaultLanguage: "",
    extraAttrs: [
        { name: "userInputLanguage", default: "" },
        { name: "inlineDecorateType", default: InlineDecorateType.Ignore },
    ],
}

export class RinoCodeBlockExtension extends CodeBlockExtension implements MarkdownNodeExtension {
    get defaultOptions() {
        return { ...defaultRinoCodeBlockExtensionOptions }
    }

    public keys(params: ExtensionManagerNodeTypeParams): KeyBindings {
        return {
            ...super.keys(params),
            ...buildBlockEnterKeymapBindings(/^```([a-zA-Z]*)?$/, params.type, {
                getAttrs: match => {
                    const userInputLanguage = match[1] || ""
                    return {
                        language: getLanguage({
                            language: userInputLanguage,
                            fallback: this.options.defaultLanguage,
                            supportedLanguages: this.options.supportedLanguages,
                        }),
                        userInputLanguage,
                    }
                },
            }),
        }
    }

    // Override the default input rules from remirror
    public inputRules() {
        return []
    }

    toMarkdown() {}
    fromMarkdown() {}
}
