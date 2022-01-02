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
        return parser.parse(content)
    }

    const docToString: DocToString = (doc) => {
        return serializer.serialize(doc)
    }

    return { manager, stringToDoc, docToString }
}
