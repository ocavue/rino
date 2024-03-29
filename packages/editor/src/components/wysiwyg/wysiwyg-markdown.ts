import { AnyExtension, isExtension, RemirrorManager } from "@remirror/core"

import { MarkdownNodeExtension } from "../../extensions"
import { MarkdownParser, MarkdownSerializer, NodeSerializerSpecs, ParserRule } from "../../transform"

function isMarkdownNodeExtension(extension: unknown): extension is MarkdownNodeExtension {
    return !!(
        isExtension(extension) &&
        (extension as unknown as MarkdownNodeExtension).fromMarkdown &&
        (extension as unknown as MarkdownNodeExtension).toMarkdown
    )
}

export function buildMarkdownParser<Extension extends AnyExtension>(manager: RemirrorManager<Extension>) {
    const parserRules: ParserRule[] = []
    for (const extension of manager.extensions) {
        if (isMarkdownNodeExtension(extension)) {
            parserRules.push(...extension.fromMarkdown())
        }
    }
    return new MarkdownParser(manager.schema, parserRules)
}

export function buildMarkdownSerializer<Extension extends AnyExtension>(manager: RemirrorManager<Extension>) {
    const specs: NodeSerializerSpecs = {}
    for (const extension of manager.extensions) {
        if (isMarkdownNodeExtension(extension)) {
            specs[extension.name] = extension.toMarkdown
        }
    }
    return new MarkdownSerializer(specs)
}
