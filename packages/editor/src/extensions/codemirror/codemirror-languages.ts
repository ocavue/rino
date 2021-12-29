import { LanguageDescription } from "@codemirror/language"
import { languages } from "@codemirror/language-data"

export const markdownLanguage = LanguageDescription.of({
    name: "Markdown",
    extensions: ["md", "markdown", "mkd"],
    load: async () => {
        const model = await import("@codemirror/lang-markdown")
        return model.markdown({ codeLanguages: languages, base: model.markdownLanguage })
    },
})

export const allLanguages = languages.filter((language) => language.name !== "Markdown").concat(markdownLanguage)
