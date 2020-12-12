import { RemirrorManager } from "@remirror/core"
import { ReactCombinedUnion, useManager } from "@remirror/react"

import { createWysiwygCombined, WysiwygCombined } from "./wysiwyg-extension"

export type WysiwygManager = RemirrorManager<ReactCombinedUnion<WysiwygCombined>>

export function useWysiwygManager(): WysiwygManager {
    return useManager(createWysiwygCombined)
}

export type WysiwygSchema = WysiwygManager["schema"]
export type WysiwygExtensions = WysiwygManager["extensions"]
export type WysiwygExtension = WysiwygManager["extensions"][number]
