import {
    inputRules,
    InputRule,
    wrappingInputRule,
    textblockTypeInputRule,
} from "prosemirror-inputrules"
import { Node } from "prosemirror-model"
import { Plugin, EditorState } from "prosemirror-state"

import { schema } from "./schema"

function buildMdInputRules(): Plugin {
    return inputRules({
        rules: [
            // heading
            textblockTypeInputRule(/^(#{1,6})\s$/, schema.nodes.rinoHeading, (match: string[]) => ({
                level: match[1].length,
            })),

            // ordered list
            wrappingInputRule(
                /^(\d+)\.\s$/,
                schema.nodes.rinoOrderedList,
                (match: string[]) => ({ order: +match[1] }),
                (match: string[], node: Node) => node.childCount + node.attrs.order == +match[1],
            ),

            // bullet list
            wrappingInputRule(/^\s*([-+*])\s$/, schema.nodes.rinoBulletList),

            // checkbox list item
            new InputRule(/^\[([ |x])\] $/, function(state: EditorState, match, start, end) {
                const $from = state.selection.$from
                if (
                    $from.depth >= 3 &&
                    $from.node(-1).type.name === "rinoListItem" &&
                    $from.node(-2).type.name === "rinoBulletList" &&
                    $from.index(-1) === 0 // The cursor is at the first child (paragraph) of this list item.
                ) {
                    const attrs = { checked: match[1] === "x" }
                    const listItemPos = $from.before(-1)
                    return state.tr
                        .delete(start, end)
                        .insert(listItemPos + 1, schema.nodes.rinoCheckbox.create(attrs))
                }
                return null
            }),

            // block quote
            wrappingInputRule(/^\s*>\s$/, schema.nodes.rinoBlockquote),
        ],
    })
}

export { buildMdInputRules }
