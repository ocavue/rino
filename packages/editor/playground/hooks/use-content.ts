import { useCallback, useState } from "react"

import { contentMap } from "../content"
import updateURLParams from "../utils/update-url"

export default function useContent(initContentId: string, initContent: string) {
    const [contentId, setContentId] = useState(initContentId)
    const [content, setContent] = useState(initContent)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    return {
        contentId,
        content,
        hasUnsavedChanges,
        setContentId: useCallback((newId: string) => {
            setContentId(newId)
            setContent(contentMap[newId])
            updateURLParams({ contentId: newId })
        }, []),
        setContent: useCallback(
            (newContent: string) => {
                contentMap[contentId] = newContent
                setContent(newContent)
            },
            [contentId],
        ),
        setHasUnsavedChanges,
    }
}
