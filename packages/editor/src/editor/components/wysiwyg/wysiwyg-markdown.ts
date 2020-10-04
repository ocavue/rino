import { AnyCombinedUnion, isExtension, RemirrorManager } from "@remirror/core"

import { MarkdownParser } from "src/editor/transform/parser"
import { ParserRule } from "src/editor/transform/parser-type"
import { MarkdownSerializer, NodeSerializerSpecs } from "src/editor/transform/serializer"
import { MarkdownNodeExtension } from "src/editor/utils"

function isMarkdownNodeExtension(extension: unknown): extension is MarkdownNodeExtension {
    return !!(
        isExtension(extension) &&
        ((extension as unknown) as MarkdownNodeExtension).fromMarkdown &&
        ((extension as unknown) as MarkdownNodeExtension).toMarkdown
    )
}

export function buildMarkdownParser<Combined extends AnyCombinedUnion>(
    manager: RemirrorManager<Combined>,
) {
    const parserRules: ParserRule[] = []
    for (const extension of manager.extensions) {
        if (isMarkdownNodeExtension(extension)) {
            parserRules.push(...extension.fromMarkdown())
        }
    }
    return new MarkdownParser(manager.schema, parserRules)
}

export function buildMarkdownSerializer<Combined extends AnyCombinedUnion>(
    manager: RemirrorManager<Combined>,
) {
    const specs: NodeSerializerSpecs = {}
    for (const extension of manager.extensions) {
        if (isMarkdownNodeExtension(extension)) {
            specs[extension.name] = extension.toMarkdown
        }
    }
    return new MarkdownSerializer(specs)
}
