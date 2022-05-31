import { chainCommands, convertCommand } from "@remirror/core"
import { HardBreakExtension } from "@remirror/extension-hard-break"
import { baseKeymap, exitCode } from "prosemirror-commands"

import { NodeSerializerOptions } from "../../transform"

export class RinoHardBreakExtension extends HardBreakExtension {
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

    createKeymap() {
        const type = this.type
        const command = chainCommands(convertCommand(exitCode), (params) => {
            const $from = params.state.selection.$from
            const canReplace = $from.node($from.depth).canReplaceWith($from.index($from.depth), $from.indexAfter($from.depth), type)

            if (canReplace) {
                const { dispatch } = params
                if (dispatch) {
                    dispatch(params.state.tr.replaceSelectionWith(this.type.create()).scrollIntoView())
                }
                return true
            } else {
                // If the parent doesn't allow HardBreak type (Heading for example), then failback to `Enter` command
                return convertCommand(baseKeymap["Enter"])(params)
            }
        })

        return {
            "Mod-Enter": command,
            "Shift-Enter": command,
        }
    }
}
