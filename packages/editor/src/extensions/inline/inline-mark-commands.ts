import { CommandFunction, CommandFunctionProps, ProsemirrorNode } from "@remirror/core"
import { TextSelection } from "prosemirror-state"

import { updateRangeMarks } from "./inline-mark-helpers"

type CreateInlineKeyBindingProps = {
    left: string
    right: string
    mark: ToggleableInlineMarkName
}

function toggleSimpleInlineMark({ left, right, mark }: CreateInlineKeyBindingProps): CommandFunction {
    return (props: CommandFunctionProps): boolean => {
        const { tr, dispatch, state } = props
        const { $from, $to, anchor, head } = state.selection

        if (!$from.sameParent($to) || !$from.parent.type.isTextblock) {
            return false
        }

        const parent = $from.parent

        let fromIndex = $from.index()
        let toIndex = $to.index()

        if (toIndex > fromIndex && $to.textOffset === 0) {
            // `$to` is between two text nodes and `toIndex` is pointing to the right node. Let's make it point to the left node.
            toIndex -= 1
        }

        if (fromIndex < toIndex) {
            const toTextNode = parent.child(toIndex)
            if (hasMark(toTextNode, "mdMark") && toTextNode.textContent === right) {
                toIndex -= 1
            }
        }

        if (fromIndex < toIndex) {
            const fromTextNode = parent.child(fromIndex)
            if (hasMark(fromTextNode, "mdMark") && fromTextNode.textContent === left) {
                fromIndex += 1
            }
        }

        if (fromIndex === toIndex) {
            console.debug("same text node :)")
            const textNode = parent.child(fromIndex)
            const markType = state.schema.marks[mark]
            if (!markType) {
                console.warn(`failed to find mark type "${mark}" in the schema`)
                return false
            }

            if (textNode.marks.map((mark) => mark.type.name).includes(mark)) {
                // remove marks
                const prevMarkIndex = fromIndex - 1
                const nextMarkIndex = fromIndex + 1
                if (dispatch && prevMarkIndex >= 0) {
                    tr.delete()
                }
                return true
            }
        } else {
            console.debug("different text node :(")
        }

        console.log("index", $from.index(), $to.index(), $from.indexAfter(), $to.indexAfter(), $from.parentOffset, $to.parentOffset)

        const selectedSlice = parent.slice($from.parentOffset, $to.parentOffset)
        console.log("selectedSlice", selectedSlice.content.childCount)

        if (dispatch) {
            tr.insertText(right, $to.pos)
            tr.insertText(left, $from.pos)
            const offset = left.length
            tr.setSelection(TextSelection.create(tr.doc, anchor + offset, head + offset))
            updateRangeMarks(tr)
            dispatch(tr)
        }
        return true
    }
}

export type ToggleableInlineMarkName = "mdStrong" | "mdEm" | "mdCodeText" | "mdDel"

export function toggleInlineMark(mark: ToggleableInlineMarkName): CommandFunction {
    switch (mark) {
        case "mdStrong":
            return toggleSimpleInlineMark({ mark, left: "**", right: "**" })
        case "mdEm":
            return toggleSimpleInlineMark({ mark, left: "*", right: "*" })
        case "mdCodeText":
            return toggleSimpleInlineMark({ mark, left: "`", right: "`" })
        case "mdDel":
            return toggleSimpleInlineMark({ mark, left: "~~", right: "~~" })
        default:
            throwUnknownMarkError(mark)
    }
}

export type ToggleInlineMark = typeof toggleInlineMark

function throwUnknownMarkError(mark: never): never {
    throw new Error(`Unknown mark to toggle: ${mark}`)
}

function hasMark(node: ProsemirrorNode, mark: string): boolean {
    return node.marks.some((m) => m.type.name === mark)
}
