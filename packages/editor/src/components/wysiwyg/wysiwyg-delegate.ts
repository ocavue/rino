import { initDocMarks } from "../../extensions/inline"
import { DocToString, StringToDoc, WysiwygOptions } from "../types"
import { createWysiwygManager } from "./wysiwyg-manager"
import { buildMarkdownParser, buildMarkdownSerializer } from "./wysiwyg-markdown"

export function createWysiwygDelegate(wysiwygOptions: WysiwygOptions) {
    const manager = createWysiwygManager(wysiwygOptions)

    const parser = buildMarkdownParser(manager)
    const serializer = buildMarkdownSerializer(manager)

    const stringToDoc: StringToDoc = (content) => {
        if (wysiwygOptions.isTesting) {
            if (content.trim() === "HOOK:FAILED_TO_INIT_PROSEMIRROR_VIEW") {
                throw new Error("Found error hook for testing")
            }
        }

        // Get the doc without inline marks
        const doc = parser.parse(content)

        console.log('doc:',doc.toJSON())

        // Apply inline marks to the doc
        return initDocMarks(doc)
    }

    const docToString: DocToString = (doc) => {
        return serializer.serialize(doc)
    }

    return { manager, stringToDoc, docToString }
}
