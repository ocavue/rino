import { oneDark } from "@codemirror/theme-one-dark"
import { EditorView } from "@codemirror/view"
import { CodeMirrorExtensionOptions } from "@remirror/extension-codemirror6"

import { allLanguages, markdownLanguage } from "./codemirror-languages"
import { basicSetup } from "./codemirror-setup"

export function buildCodeMirrorOptions({ onlyMarkdown }: { onlyMarkdown: boolean }): CodeMirrorExtensionOptions {
    return {
        languages: onlyMarkdown ? [markdownLanguage] : allLanguages,
        extensions: [basicSetup, oneDark, EditorView.lineWrapping],
    }
}
