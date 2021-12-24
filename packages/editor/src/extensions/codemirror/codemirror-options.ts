import { basicSetup } from "@codemirror/basic-setup"
import { LanguageDescription } from "@codemirror/language"
import { languages } from "@codemirror/language-data"
import { oneDark } from "@codemirror/theme-one-dark"
import { EditorView } from "@codemirror/view"
import { CodeMirrorExtensionOptions } from "@remirror/extension-codemirror6"

const markdownLanguage = LanguageDescription.of({
    name: "Markdown",
    extensions: ["md", "markdown", "mkd"],
    load: async () => {
        const model = await import("@codemirror/lang-markdown")
        return model.markdown({ codeLanguages: languages })
    },
})

const allLanguages = languages.filter((language) => language.name !== "Markdown").concat(markdownLanguage)

export function buildCodeMirrorOptions({ onlyMarkdown }: { onlyMarkdown: boolean }): CodeMirrorExtensionOptions {
    return {
        languages: onlyMarkdown ? [markdownLanguage] : allLanguages,
        extensions: [basicSetup, oneDark, EditorView.lineWrapping],
    }
}
