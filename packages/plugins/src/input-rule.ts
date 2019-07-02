import { inputRules, wrappingInputRule, textblockTypeInputRule } from "prosemirror-inputrules"
import { Node } from "prosemirror-model"
import { Plugin } from "prosemirror-state"

import { schema } from "../../markdown"

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

            // block quote
            wrappingInputRule(/^\s*>\s$/, schema.nodes.rinoBlockquote),
        ],
    })
}

export { buildMdInputRules }
