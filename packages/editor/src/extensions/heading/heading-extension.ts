import {
    ApplySchemaAttributes,
    convertCommand,
    findParentNodeOfType,
    KeyBindings,
    NodeExtensionSpec,
    NodeSpecOverride,
} from "@remirror/core"
import { HeadingExtension } from "@remirror/extension-heading"
import { setBlockType } from "@remirror/pm/commands"
import { Schema } from "@remirror/pm/model"
import Token from "markdown-it/lib/token"

import { NodeSerializerOptions, ParserRuleType } from "../../transform"

export class RinoHeadingExtension extends HeadingExtension {
    createNodeSpec(extra: ApplySchemaAttributes, override: NodeSpecOverride): NodeExtensionSpec {
        return {
            ...super.createNodeSpec(extra, override),
            content: "text*", // Disallow hard breaks in headings
        }
    }

    createKeymap() {
        const keys: KeyBindings = {
            Backspace: ({ state, dispatch }) => {
                const { selection } = state

                // If the selection is not empty, return false and let other extension (ie: BaseKeymapExtension) to do
                // the deleting operation.
                if (!selection.empty) {
                    return false
                }

                const parent = findParentNodeOfType({ types: this.type, selection })
                if (parent?.start !== selection.from) {
                    return false
                }

                const tr = state.tr.setBlockType(parent.start, parent.start, (state.schema as Schema).nodes.paragraph)
                if (dispatch) {
                    dispatch(tr)
                }
                return true
            },
        }

        this.options.levels.forEach((level) => {
            keys[`mod-${level}`] = convertCommand(setBlockType(this.type, { level }))
        })

        return keys
    }

    fromMarkdown() {
        return [
            {
                type: ParserRuleType.block,
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
