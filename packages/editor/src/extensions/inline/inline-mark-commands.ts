import { CommandFunction, CommandFunctionProps } from "@remirror/core"
import { TextSelection } from "prosemirror-state"

import { updateRangeMarks } from "./inline-mark-helpers"

type CreateInlineKeyBindingProps = {
    left: string
    right: string
}

function doToggleInlineMark({ left, right }: CreateInlineKeyBindingProps): CommandFunction {
    return (props: CommandFunctionProps): boolean => {
        const { tr, dispatch } = props
        const { $from, $to, anchor, head } = props.state.selection

        if ($from.sameParent($to) && $from.parent.type.isTextblock) {
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

        return false
    }
}

export type ToggleableInlineMarkName = "mdStrong" | "mdEm" | "mdCodeText" | "mdDel"

export function toggleInlineMark(mark: ToggleableInlineMarkName): CommandFunction {
    switch (mark) {
        case "mdStrong":
            return doToggleInlineMark({ left: "**", right: "**" })
        case "mdEm":
            return doToggleInlineMark({ left: "*", right: "*" })
        case "mdCodeText":
            return doToggleInlineMark({ left: "`", right: "`" })
        case "mdDel":
            return doToggleInlineMark({ left: "~~", right: "~~" })
        default:
            throwUnknownMarkError(mark)
    }
}

export type ToggleInlineMark = typeof toggleInlineMark

function throwUnknownMarkError(mark: never): never {
    throw new Error(`Unknown mark to toggle: ${mark}`)
}
