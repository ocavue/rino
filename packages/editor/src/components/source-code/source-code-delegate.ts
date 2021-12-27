import { DocToString, StringToDoc } from "../types"
import { createSourceCodeManager } from "."

export function createSourceCodeDelegate() {
    const manager = createSourceCodeManager()

    const stringToDoc: StringToDoc = (content) => {
        const schema = manager.schema
        const attrs = { language: "markdown" }
        const child = content ? schema.text(content) : undefined
        return schema.nodes.doc.create({}, schema.nodes.codeMirror.create(attrs, child))
    }

    const docToString: DocToString = (doc) => {
        return doc.textContent
    }

    return { manager, stringToDoc, docToString }
}
