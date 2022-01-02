import { createReactManager } from "@remirror/react"

import { WysiwygOptions } from "../types"
import { createWysiwygExtension } from "./wysiwyg-extension"

export function createWysiwygManager(options: WysiwygOptions) {
    return createReactManager(() => createWysiwygExtension(options))
}

export type WysiwygManager = ReturnType<typeof createWysiwygManager>
export type WysiwygSchema = WysiwygManager["schema"]
export type WysiwygExtensions = WysiwygManager["extensions"]
