import { ExtensionManager, InferFlexibleExtensionList, SchemaFromExtensions } from "@remirror/core"
import { baseExtensions } from "@remirror/core-extensions"
import { CodeBlockExtension } from "@remirror/extension-code-block"
import { useMemo } from "react"
import markdown from "refractor/lang/markdown"

const sourceCodeExtensions = [
    ...baseExtensions,
    {
        priority: 1,
        extension: new CodeBlockExtension({
            defaultLanguage: "markdown",
            supportedLanguages: [markdown],
            toggleType: "codeBlock",
        }),
    },
]

export type SourceCodeExtensions = InferFlexibleExtensionList<typeof sourceCodeExtensions>
export type SourceCodeManager = ExtensionManager<SourceCodeExtensions>
export type SourceCodeSchema = SchemaFromExtensions<SourceCodeExtensions>

export function useSourceCodeManager() {
    return useMemo(() => {
        return ExtensionManager.create(sourceCodeExtensions)
    }, [])
}
