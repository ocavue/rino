import {
    convertCommand,
    ExtensionManagerNodeTypeParams,
    findParentNodeOfType,
    KeyBindings,
    NodeExtensionSpec,
} from "@remirror/core"
import { HeadingExtension, HeadingExtensionOptions } from "@remirror/core-extensions"
import Token from "markdown-it/lib/token"
import { setBlockType } from "prosemirror-commands"
import { Schema } from "prosemirror-model"

import { ParserTokenType } from "src/editor/transform/parser-type"
import { NodeSerializerOptions } from "src/editor/transform/serializer"
import { MarkdownNodeExtension } from "src/editor/utils"

export class RinoHeadingExtension extends HeadingExtension
    implements MarkdownNodeExtension<HeadingExtensionOptions> {
    get schema(): NodeExtensionSpec {
        return {
            ...super.schema,
            content: "text*", // Disallow hard breaks in headings
        }
    }

    public keys({ type }: ExtensionManagerNodeTypeParams): KeyBindings {
        const keys: KeyBindings = {
            Backspace: ({ state, dispatch }) => {
                const { selection } = state

                // If the selection is not empty, return false and let other extension (ie: BaseKeymapExtension) to do
                // the deleting operation.
                if (!selection.empty) {
                    return false
                }

                const parent = findParentNodeOfType({ types: type, selection })
                if (parent?.start !== selection.from) {
                    return false
                }

                const tr = state.tr.setBlockType(
                    parent.start,
                    parent.start,
                    (state.schema as Schema).nodes.paragraph,
                )
                if (dispatch) {
                    dispatch(tr)
                }
                return true
            },
        }

        this.options.levels.forEach((level) => {
            keys[`mod-${level}`] = convertCommand(setBlockType(type, { level }))
        })

        return keys
    }

    fromMarkdown() {
        return [
            {
                type: ParserTokenType.block,
                token: "heading",
                node: this.name,
                hasOpenClose: true,
                getAttrs: (tok: Token) => ({ level: +tok.tag.slice(1) }),
            },
        ] as const
    }
    toMarkdown({ state, node }: NodeSerializerOptions) {
        state.write(state.repeat("#", node.attrs.level) + " ")
        state.renderInline(node)
        state.closeBlock(node)
    }
}
