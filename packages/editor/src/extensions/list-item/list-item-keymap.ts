import { KeyBindings, NodeType } from "@remirror/core"
import { liftTarget } from "@remirror/pm/transform"

import { createSplitListCommand } from "./list-item-commands"

export function createListItemKeymap(itemType: NodeType): KeyBindings {
    return {
        Enter: createSplitListCommand(itemType),

        "Shift-Tab": (props): boolean => {
            const { state, dispatch, tr } = props

            const { $from, $to } = state.selection
            const range = $from.blockRange($to, (node) => node.type == itemType)

            if (!range) return false

            const target = liftTarget(range)
            if (target == null) return false

            if (!dispatch) return true

            dispatch(tr.lift(range, target).scrollIntoView())

            // if ($from.node(range.depth - 1).type == itemType)
            //     // Inside a parent list
            //     return liftToOuterList(state, dispatch, itemType, range)
            // // Outer list node
            // else return liftOutOfList(state, dispatch, range)
            // console.debug(props)
            return true
        },
    }
}
