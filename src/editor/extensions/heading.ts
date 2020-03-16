import {
    ExtensionManagerNodeTypeParams,
    KeyBindings,
    convertCommand,
    findParentNodeOfType,
} from "@remirror/core"
import { HeadingExtension, HeadingExtensionOptions } from "@remirror/core-extensions"
import { MarkdownNodeExtension } from "../utils"
import { NodeSerializerOptions } from "../transform/serializer"
import { ParserTokenType } from "../transform/parser-type"
import { setBlockType } from "prosemirror-commands"
import Token from "markdown-it/lib/token"

export class RinoHeadingExtension extends HeadingExtension
    implements MarkdownNodeExtension<HeadingExtensionOptions> {
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
                    state.schema.nodes.paragraph,
                )
                if (dispatch) {
                    dispatch(tr)
                }
                return true
            },
        }

        this.options.levels.forEach(level => {
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
