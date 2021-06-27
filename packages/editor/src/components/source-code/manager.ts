import { DocExtension } from "@remirror/extension-doc"
import { useRemirror } from "@remirror/react"
import CodeMirror from "codemirror"

import { RinoCodeBlockExtension } from "../../extensions"

export function useSourceCodeRemirror() {
    return useRemirror({
        extensions: () => [
            new DocExtension({ content: "codeMirror" }),
            new RinoCodeBlockExtension({ CodeMirror, defaultCodeMirrorConfig: { mode: "text/x-markdown" } }),
        ],
    })
}

export type SourceCodeManager = ReturnType<typeof useSourceCodeRemirror>["manager"]
export type SourceCodeSchema = SourceCodeManager["schema"]
export type SourceCodeExtension = SourceCodeManager["extensions"][number]
