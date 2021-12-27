import { createReactManager } from "@remirror/react"

import { createWysiwygExtension } from "./wysiwyg-extension"

export function createWysiwygManager() {
    return createReactManager(() => createWysiwygExtension())
}

export type WysiwygManager = ReturnType<typeof createWysiwygManager>
export type WysiwygSchema = WysiwygManager["schema"]
export type WysiwygExtensions = WysiwygManager["extensions"]
