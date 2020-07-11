import { CorePreset } from '@remirror/preset-core';
import { useManager } from '@remirror/react';
import { BoldExtension } from '@remirror/extension-bold';
import { ItalicExtension } from '@remirror/extension-italic';
import { UnderlineExtension } from '@remirror/extension-underline';


import { CodeBlockExtension } from "@remirror/extension-code-block"
import markdown from "refractor/lang/markdown"


export function useSourceCodeManager() {
    return useManager([
        new CorePreset({}),
        new BoldExtension({}),
        new ItalicExtension(),
        new UnderlineExtension(),
        new CodeBlockExtension({
            defaultLanguage: "markdown",
            // toggleType: "codeBlock",
            supportedLanguages: [markdown],
        })
    ])
}

export type SourceCodeManager = ReturnType<typeof useSourceCodeManager>
export type SourceCodeSchema = SourceCodeManager['schema']
export type SourceCodeExtensions  = SourceCodeManager['extensions']
