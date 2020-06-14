import { AnyExtension, ExtensionManager, FlexibleExtension, isExtension } from "@remirror/core"

import { MarkdownParser } from "src/editor/transform/parser"
import { ParserRule } from "src/editor/transform/parser-type"
import { MarkdownSerializer, NodeSerializerSpecs } from "src/editor/transform/serializer"
import { MarkdownNodeExtension } from "src/editor/utils"

function isMarkdownNodeExtension(extension: FlexibleExtension): extension is MarkdownNodeExtension {
    return !!(
        isExtension(extension) &&
        (extension as MarkdownNodeExtension).fromMarkdown &&
        (extension as MarkdownNodeExtension).toMarkdown
    )
}

function filterMarkdownNodeExtensions<Extension extends AnyExtension>(
    manage: ExtensionManager<Extension>,
): MarkdownNodeExtension[] {
    const markdownNodeExtensions: MarkdownNodeExtension[] = []
    for (const extension of manage.extensions) {
        if (isMarkdownNodeExtension(extension)) {
            markdownNodeExtensions.push(extension)
        }
    }
    return markdownNodeExtensions
}

export function buildMarkdownParser<Extension extends AnyExtension>(
    manager: ExtensionManager<Extension>,
) {
    const parserRules = filterMarkdownNodeExtensions(manager).reduce(
        (tokens, extension): ParserRule[] => [...tokens, ...extension.fromMarkdown()],
        [] as ParserRule[],
    )

    return new MarkdownParser(manager.schema, parserRules)
}

export function buildMarkdownSerializer<Extension extends AnyExtension>(
    manager: ExtensionManager<Extension>,
) {
    const specs: NodeSerializerSpecs = filterMarkdownNodeExtensions(manager).reduce(
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
