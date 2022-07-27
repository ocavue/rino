import { CommandFunction, convertCommand, DispatchFunction } from "@remirror/pm"
import { chainCommands as pmChainCommands, createParagraphNear, newlineInCode, splitBlock } from "@remirror/pm/commands"
import { Fragment, NodeRange, NodeType, Slice } from "@remirror/pm/model"
import { Transaction } from "@remirror/pm/state"
import { canSplit, liftTarget, ReplaceAroundStep } from "@remirror/pm/transform"

import { findItemRange, isBlockNodeSelection, isItemRangeForIndentation } from "./list-utils"

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
        // also don't want to lift the parent block. So we use the original
        // ProseMirror `Enter` keybinding but remove the `liftEmptyBlock`
        // command from it.
        if ($from.index(-1) !== 0) {
            return enterWithoutLift(props)
        }

        // If the parent block is empty, we lift this empty block.
        if ($from.parent.content.size == 0) {
            return false
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

export function createDedentListCommand(itemType: NodeType): CommandFunction {
    return (props): boolean => {
        const { state, dispatch, tr } = props

        const { $from, $to } = state.selection
        const range = findItemRange($from, $to, itemType)

        if (!range) {
            return false
        }

        if (isItemRangeForIndentation(range) && range.parent.type === itemType) {
            return liftToOuterList(tr, dispatch, itemType, range)
        } else {
            const range = $from.blockRange($to)
            if (!range) {
                return false
            }
            return liftBlockRange(tr, dispatch, range)
        }
    }
}

function liftToOuterList(tr: Transaction, dispatch: DispatchFunction | undefined, itemType: NodeType, range: NodeRange) {
    const endOfItem = range.end
    const endOfSiblings = range.$to.end(range.depth)

    if (endOfItem < endOfSiblings) {
        // There are siblings after the lifted items, which must become
        // children of the last item
        tr.step(
            new ReplaceAroundStep(
                endOfItem - 1,
                endOfSiblings,
                endOfItem,
                endOfSiblings,
                new Slice(Fragment.from(itemType.create(null)), 1, 0),
                0,
                true,
            ),
        )
        range = new NodeRange(tr.doc.resolve(range.$from.pos), tr.doc.resolve(endOfSiblings), range.depth)
    }
    return liftBlockRange(tr, dispatch, range)
}

function liftBlockRange(tr: Transaction, dispatch: DispatchFunction | undefined, range: NodeRange) {
    const target = liftTarget(range)
    if (target == null) return false
    dispatch?.(tr.lift(range, target).scrollIntoView())
    return true
}

export function createIndentListCommand(itemType: NodeType): CommandFunction {
    return (props): boolean => {
        const { tr, dispatch } = props

        const { $from, $to } = tr.selection
        const range = findItemRange($from, $to, itemType)

        if (!range) return false

        const { startIndex, endIndex, parent, depth } = range

        // If the previous sibling is not a list item, we can't indent
        if (startIndex === 0) {
            return false
        }
        const itemBefore = parent.child(startIndex - 1)
        if (itemBefore.type !== itemType) {
            return false
        }

        if (dispatch) {
            const itemCount = endIndex - startIndex

            // If only one item is in the range, and there is some content
            if (itemCount === 1 && $from.depth > depth && $to.depth > depth) {
                const blockRange = new NodeRange($from, $to, depth + 1)

                if (blockRange.end + 1 < range.end) {
                    tr.lift(new NodeRange(tr.doc.resolve(blockRange.end + 2), tr.doc.resolve(range.end - 1), depth + 1), depth)
                }
            }
            const slice = new Slice(Fragment.from(itemBefore.copy()), 1, 0)
            const before = range.start,
                after = range.end
            tr.step(new ReplaceAroundStep(before - 1, after, before, after, slice, 0, true))
            dispatch(tr.scrollIntoView())
        }
        return true
    }
}
