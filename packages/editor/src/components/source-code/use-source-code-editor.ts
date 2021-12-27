import { useCallback, useMemo } from "react"

import { DocToString, StringToDoc } from "../types"
import { useSourceCodeRemirror } from "."

export function useSourceCodeEditor() {
    const { manager } = useSourceCodeRemirror()

    const stringToDoc: StringToDoc = useCallback(
        (content) => {
            const schema = manager.schema
            const attrs = { language: "markdown" }
            const child = content ? schema.text(content) : undefined
            return schema.nodes.doc.create({}, schema.nodes.codeMirror.create(attrs, child))
        },
        [manager],
    )

    const docToString: DocToString = useCallback((doc) => {
        return doc.textContent
    }, [])

    return useMemo(() => ({ manager, stringToDoc, docToString }), [manager, stringToDoc, docToString])
}
