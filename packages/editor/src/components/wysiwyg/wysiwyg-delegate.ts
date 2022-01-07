import { Transform } from "prosemirror-transform"

import { updateMarks } from "../../extensions/inline"
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

        // Apply inline marks to the doc
        const tr = new Transform(doc)
        updateMarks(tr, doc, 0)
        return tr.doc
    }

    const docToString: DocToString = (doc) => {
        return serializer.serialize(doc)
    }

    return { manager, stringToDoc, docToString }
}
