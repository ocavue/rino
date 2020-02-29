import {
    ExtensionManagerNodeTypeParams,
    KeyBindings,
    convertCommand,
    findParentNodeOfType,
} from "@remirror/core"
import { HeadingExtension } from "@remirror/core-extensions"
import { MarkdownNodeExtension } from "../utils"
import { setBlockType } from "prosemirror-commands"

export class RinoHeadingExtension extends HeadingExtension implements MarkdownNodeExtension {
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

    toMarkdown() {}
    fromMarkdown() {}
}
