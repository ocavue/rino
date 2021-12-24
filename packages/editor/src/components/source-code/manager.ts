import { basicSetup } from "@codemirror/basic-setup"
import { languages } from "@codemirror/language-data"
import { oneDark } from "@codemirror/theme-one-dark"
import { DocExtension } from "@remirror/extension-doc"
import { useRemirror } from "@remirror/react"

import { RinoCodeMirrorExtension } from "../../extensions"

export function useSourceCodeRemirror() {
    return useRemirror({
        extensions: () => [
            new DocExtension({ content: "codeMirror" }),
            new RinoCodeMirrorExtension({
                languages: languages,
                extensions: [basicSetup, oneDark],
            }),
        ],
    })
}

export type SourceCodeManager = ReturnType<typeof useSourceCodeRemirror>["manager"]
export type SourceCodeSchema = SourceCodeManager["schema"]
export type SourceCodeExtension = SourceCodeManager["extensions"][number]
