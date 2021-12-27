import { useCallback, useMemo, useState } from "react"

import { DocToString, StringToDoc } from "../types"
import { useWysiwygRemirror } from "./wysiwyg-manager"
import { buildMarkdownParser, buildMarkdownSerializer } from "./wysiwyg-markdown"

type UseWysiwygEditorProps = {
    isTestEnv?: boolean
}

export function useWysiwygEditor({ isTestEnv }: UseWysiwygEditorProps) {
    const { manager } = useWysiwygRemirror()

    const parser = useMemo(() => buildMarkdownParser(manager), [manager])
    const serializer = useMemo(() => buildMarkdownSerializer(manager), [manager])

    const stringToDoc: StringToDoc = useCallback(
        (content) => {
            if (isTestEnv) {
                if (content.trim() === "HOOK:FAILED_TO_INIT_PROSEMIRROR_VIEW") {
                    throw new Error("Found error hook for testing")
                }
            }
            return parser.parse(content)
        },
        [isTestEnv, parser],
    )

    const docToString: DocToString = useCallback(
        (doc) => {
            if (!doc) return null
            return serializer.serialize(doc)
        },
        [serializer],
    )

    return {
        manager,
        stringToDoc,
        docToString,
    }
}
