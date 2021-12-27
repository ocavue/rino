import { DocExtension } from "@remirror/extension-doc"
import { createReactManager } from "@remirror/react"

import { buildCodeMirrorOptions, RinoCodeMirrorExtension } from "../../extensions"

export function createSourceCodeManager() {
    return createReactManager(() => [
        new DocExtension({ content: "codeMirror" }),
        new RinoCodeMirrorExtension(buildCodeMirrorOptions({ onlyMarkdown: true })),
    ])
}

export type SourceCodeManager = ReturnType<typeof createSourceCodeManager>
export type SourceCodeSchema = SourceCodeManager["schema"]
export type SourceCodeExtension = SourceCodeManager["extensions"][number]
