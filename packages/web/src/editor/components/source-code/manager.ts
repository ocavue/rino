import { CorePreset } from "@remirror/preset-core"
import { useManager } from "@remirror/react"

import { RinoCodeBlockExtension } from "src/editor/extensions"

export function useSourceCodeManager() {
    return useManager([
        new CorePreset({}),
        new RinoCodeBlockExtension({ defaultCodeMirrorConfig: { mode: "text/x-markdown" } }),
    ])
}

export type SourceCodeManager = ReturnType<typeof useSourceCodeManager>
export type SourceCodeSchema = SourceCodeManager["schema"]
export type SourceCodeExtension = SourceCodeManager["extensions"][number]
export type SourceCodeCombined = SourceCodeManager["combined"][number]
