import { DocExtension } from "@remirror/extension-doc"
import { useRemirror } from "@remirror/react"

import { buildCodeMirrorOptions, RinoCodeMirrorExtension } from "../../extensions"

export function useSourceCodeRemirror() {
    return useRemirror({
        extensions: () => [
            new DocExtension({ content: "codeMirror" }),
            new RinoCodeMirrorExtension(buildCodeMirrorOptions({ onlyMarkdown: true })),
        ],
    })
}

export type SourceCodeManager = ReturnType<typeof useSourceCodeRemirror>["manager"]
export type SourceCodeSchema = SourceCodeManager["schema"]
export type SourceCodeExtension = SourceCodeManager["extensions"][number]
