import { RemirrorManager } from "@remirror/core"
import { useRef } from "react"

import { createWysiwygCombined } from "./wysiwyg-extension"

export function useWysiwygManager() {
    const manager = useRef(RemirrorManager.create(createWysiwygCombined())).current
    return manager
}

export type WysiwygManager = ReturnType<typeof useWysiwygManager>
export type WysiwygSchema = WysiwygManager["schema"]
export type WysiwygExtensions = WysiwygManager["extensions"]
export type WysiwygExtension = WysiwygManager["extensions"][number]
export type WysiwygCombined = WysiwygManager["combined"][number]
