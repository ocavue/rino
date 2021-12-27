import { DocToString, StringToDoc } from "../types"
import { createWysiwygManager } from "./wysiwyg-manager"
import { buildMarkdownParser, buildMarkdownSerializer } from "./wysiwyg-markdown"

type UseWysiwygEditorProps = {
    isTestEnv?: boolean
}

export function createWysiwygDelegate({ isTestEnv }: UseWysiwygEditorProps) {
    const manager = createWysiwygManager()

    const parser = buildMarkdownParser(manager)
    const serializer = buildMarkdownSerializer(manager)

    const stringToDoc: StringToDoc = (content) => {
        if (isTestEnv) {
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
