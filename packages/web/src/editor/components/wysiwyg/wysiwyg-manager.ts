import { useManager } from "@remirror/react"

import { wysiwygCombined } from "./wysiwyg-extension"

export function useWysiwygManager() {
    return useManager(wysiwygCombined)
}

export type WysiwygManager = ReturnType<typeof useWysiwygManager>
export type WysiwygSchema = WysiwygManager["schema"]
export type WysiwygExtensions = WysiwygManager["extensions"]
export type WysiwygExtension = WysiwygManager["extensions"][number]
export type WysiwygCombined = WysiwygManager["combined"][number]
