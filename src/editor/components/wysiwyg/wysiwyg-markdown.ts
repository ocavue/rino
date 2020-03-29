import { AnyExtension, FlexibleExtension, isExtension } from "@remirror/core"

import { MarkdownParser } from "src/editor/transform/parser"
import { ParserToken } from "src/editor/transform/parser-type"
import { MarkdownSerializer, NodeSerializerSpecs } from "src/editor/transform/serializer"
import { MarkdownNodeExtension } from "src/editor/utils"

import { wysiwygExtensions, WysiwygSchema } from "./wysiwyg-extension"

function isMarkdownNodeExtension(extension: FlexibleExtension): extension is MarkdownNodeExtension {
    return (
        isExtension(extension) && (extension as any).fromMarkdown
        // TODO: Add toMarkdown
        // isExtension(extension) && (extension as any).fromMarkdown && (extension as any).toMarkdown
    )
}

function convertToAnyExtension<T extends AnyExtension>(extension: FlexibleExtension<T>): T {
    return isExtension(extension) ? extension : extension.extension
}

const markdownNodeExtensions = (wysiwygExtensions as FlexibleExtension[])
    .map(convertToAnyExtension)
    .filter(isMarkdownNodeExtension)

export function buildMarkdownParser(schema: WysiwygSchema) {
    const parserTokens: ParserToken[] = []
    for (const extension of markdownNodeExtensions) {
        parserTokens.push(...extension.fromMarkdown())
    }

    return new MarkdownParser(schema, parserTokens)
}

export function buildMarkdownSerializer() {
    const specs: NodeSerializerSpecs = {}
    for (const extension of markdownNodeExtensions) {
        specs[extension.name] = extension.toMarkdown
    }

    return new MarkdownSerializer(specs)
}
