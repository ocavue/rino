import { useCallback, useMemo } from "react"

import { DocToString, StringToDoc } from "../types"
import { useSourceCodeRemirror } from "."
import { buildMarkdownParser, buildMarkdownSerializer } from "./wysiwyg-markdown"

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
        if (!doc) return null
        return doc.textContent
    }, [])

    return {
        manager,
        stringToDoc,
        docToString,
    }
}
