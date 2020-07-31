import { CodeBlockExtension } from "@remirror/extension-code-block"
import { CorePreset } from "@remirror/preset-core"
import { useManager } from "@remirror/react"
import markdown from "refractor/lang/markdown"

export function useSourceCodeManager() {
    return useManager([
        new CorePreset({}),

        new CodeBlockExtension({
            defaultLanguage: "markdown",
            // toggleType: "codeBlock",
            supportedLanguages: [markdown],
        }),
    ])
}

export type SourceCodeManager = ReturnType<typeof useSourceCodeManager>
export type SourceCodeSchema = SourceCodeManager["schema"]
export type SourceCodeExtension = SourceCodeManager["extensions"][number]
export type SourceCodeCombined = SourceCodeManager["combined"][number]
