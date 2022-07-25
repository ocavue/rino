import { CommandFunction, convertCommand, NodeType } from "@remirror/core"
import { chainCommands as pmChainCommands, createParagraphNear, liftEmptyBlock, newlineInCode, splitBlock } from "@remirror/pm/commands"
import { canSplit } from "@remirror/pm/transform"

import { isBlockNodeSelection } from "./list-utils"

// This command has the same behavior as the `Enter` keybinding, but without the
// `liftEmptyBlock` command.
const enterWithoutLift = convertCommand(pmChainCommands(newlineInCode, createParagraphNear, splitBlock))

export function createSplitListCommand(itemType: NodeType): CommandFunction {
    return (props): boolean => {
        const { tr, dispatch } = props
        const { selection } = props.state
        const { $from, $to } = selection

        if (isBlockNodeSelection(selection)) {
            return false
        }

        if (!$from.sameParent($to)) {
            return false
        }

        if ($from.depth < 2) {
            return false
        }

        const currItem = $from.node(-1)
        if (currItem.type !== itemType) {
            return false
        }

        // If the cursor is inside the list item, but not inside the first child
        // of the list item, then we don't want to split the list item and we
        // also don't want to lift the block. So we use the original ProseMirror
        // `Enter` keybinding but remove the `liftEmptyBlock` command from it.
        if ($from.index(-1) !== 0) {
            return enterWithoutLift(props)
        }

        // Split the list item
        const nextType = $to.pos == $from.end() ? currItem.contentMatchAt(0).defaultType : undefined
        tr.delete($from.pos, $to.pos)
        const typesAfter = [{ type: currItem.type, attrs: currItem.attrs }, nextType ? { type: nextType } : null]
        if (!canSplit(tr.doc, $from.pos, 2, typesAfter)) {
            return false
        }
        dispatch?.(tr.split($from.pos, 2, typesAfter).scrollIntoView())
        return true
    }
}
