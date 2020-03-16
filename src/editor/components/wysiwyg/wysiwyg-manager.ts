import { ExtensionManager } from "@remirror/core"

import { WysiwygExtensions, wysiwygExtensions } from "./wysiwyg-extension"
import { useMemo } from "react"

export type WysiwygManager = ExtensionManager<WysiwygExtensions>

export function createWysiwygManager(): WysiwygManager {
    return ExtensionManager.create(wysiwygExtensions)
}
export function useWysiwygManager(): WysiwygManager {
    return useMemo(createWysiwygManager, [])
}
