import {
    chainCommands,
    convertCommand,
    ExtensionManagerNodeTypeParams,
    KeyBindings,
} from "@remirror/core"
import { HardBreakExtension } from "@remirror/core-extensions"
import { baseKeymap, exitCode } from "prosemirror-commands"
import { EditorState } from "prosemirror-state"

import { NodeSerializerOptions } from "src/editor/transform/serializer"
import { MarkdownNodeExtension } from "src/editor/utils"

export class RinoHardBreakExtension extends HardBreakExtension implements MarkdownNodeExtension {
    fromMarkdown() {
        return []
    }

    toMarkdown({ state, node, parent, index }: NodeSerializerOptions) {
        for (let i = index + 1; i < parent.childCount; i++)
            if (parent.child(i).type != node.type) {
                state.write("\n")
                return
            }
    }

    public keys({ type }: ExtensionManagerNodeTypeParams): KeyBindings {
        const command = chainCommands(convertCommand(exitCode), ({ state, dispatch }) => {
            const $from = (state as EditorState).selection.$from
            const canReplace = $from
                .node($from.depth)
                .canReplaceWith($from.index($from.depth), $from.indexAfter($from.depth), type)

            if (canReplace) {
                if (dispatch) {
                    dispatch(state.tr.replaceSelectionWith(type.create()).scrollIntoView())
                    console.debug("dispatch ing !")
                }
                return true
            } else {
                // If the parent doesn't allow HardBreak type (Heading for example), then failback to `Enter` command
                return convertCommand(baseKeymap["Enter"])({ state, dispatch })
            }
        })

        return {
            "Mod-Enter": command,
            "Shift-Enter": command,
        }
    }
}
