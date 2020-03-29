import { ExtensionManager } from "@remirror/core"
import { useMemo } from "react"

import { WysiwygExtensions, wysiwygExtensions } from "./wysiwyg-extension"

export type WysiwygManager = ExtensionManager<WysiwygExtensions>

export function createWysiwygManager(): WysiwygManager {
    return ExtensionManager.create(wysiwygExtensions)
}
export function useWysiwygManager(): WysiwygManager {
    return useMemo(createWysiwygManager, [])
}
