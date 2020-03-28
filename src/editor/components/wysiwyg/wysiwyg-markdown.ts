import { AnyExtension, ExtensionManager, FlexibleExtension, isExtension } from "@remirror/core"

import { MarkdownParser } from "src/editor/transform/parser"
import { ParserToken } from "src/editor/transform/parser-type"
import { MarkdownSerializer, NodeSerializerSpecs } from "src/editor/transform/serializer"
import { MarkdownNodeExtension } from "src/editor/utils"

export function isMarkdownNodeExtension(
    extension: FlexibleExtension,
): extension is MarkdownNodeExtension {
    return !!(
        isExtension(extension) &&
        (extension as MarkdownNodeExtension).fromMarkdown &&
        (extension as MarkdownNodeExtension).toMarkdown
    )
}

export function buildMarkdownParser<Extension extends AnyExtension>(
    manage: ExtensionManager<Extension>,
) {
    const markdownNodeExtensions: MarkdownNodeExtension[] = []
    for (const extension of manage.extensions) {
        if (isMarkdownNodeExtension(extension)) {
            markdownNodeExtensions.push(extension)
        }
    }

    const parserTokens = markdownNodeExtensions.reduce(
        (tokens, extension): ParserToken[] => [...tokens, ...extension.fromMarkdown()],
        [] as ParserToken[],
    )

    return new MarkdownParser(manage.schema, parserTokens)
}

export function buildMarkdownSerializer<Extension extends AnyExtension>(
    manage: ExtensionManager<Extension>,
) {
    const markdownNodeExtensions: MarkdownNodeExtension[] = []
    for (const extension of manage.extensions) {
        if (isMarkdownNodeExtension(extension)) {
            markdownNodeExtensions.push(extension)
        }
    }

    const specs: NodeSerializerSpecs = markdownNodeExtensions.reduce(
        (specs, extension): NodeSerializerSpecs => {
            return {
                [extension.name]: extension.toMarkdown,
                ...specs,
            }
        },
        {} as NodeSerializerSpecs,
    )

    return new MarkdownSerializer(specs)
}
