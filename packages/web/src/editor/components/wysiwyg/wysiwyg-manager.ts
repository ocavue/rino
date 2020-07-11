import { RemirrorManager } from "@remirror/core"
import { useEffect, useRef } from "react"

import { createWysiwygCombined } from "./wysiwyg-extension"

export function useWysiwygManager() {
    const manager = useRef(RemirrorManager.create(createWysiwygCombined())).current

    useEffect(() => {
        return () => {
            manager.destroy()
        }
    }, [manager])

    return manager
}

export type WysiwygManager = ReturnType<typeof useWysiwygManager>
export type WysiwygSchema = WysiwygManager["schema"]
export type WysiwygExtensions = WysiwygManager["extensions"]
export type WysiwygExtension = WysiwygManager["extensions"][number]
export type WysiwygCombined = WysiwygManager["combined"][number]
