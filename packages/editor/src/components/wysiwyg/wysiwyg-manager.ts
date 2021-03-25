/* Copyright (c) 2020-present ocavue@gmail.com */

import { useRemirror } from "@remirror/react"

import { createWysiwygExtension } from "./wysiwyg-extension"

export function useWysiwygRemirror() {
    return useRemirror({ extensions: () => createWysiwygExtension() })
}

export type WysiwygRemirror = ReturnType<typeof useWysiwygRemirror>
export type WysiwygManager = WysiwygRemirror["manager"]
export type WysiwygSchema = WysiwygManager["schema"]
export type WysiwygExtensions = WysiwygManager["extensions"]
