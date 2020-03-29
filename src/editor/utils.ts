import {
    convertCommand,
    DispatchFunction,
    KeyBindings,
    NodeExtension,
    NodeExtensionOptions,
    ProsemirrorNode,
} from "@remirror/core"
import { EditorState, TextSelection, Transaction } from "prosemirror-state"

import { ParserToken } from "src/editor/transform/parser-type"
import { NodeSerializerSpec } from "src/editor/transform/serializer"

export abstract class MarkdownNodeExtension<T = NodeExtensionOptions> extends NodeExtension<T> {
    abstract fromMarkdown: () => readonly ParserToken[]
    abstract toMarkdown: NodeSerializerSpec
}

export function buildBlockEnterKeymapBindings<Node extends ProsemirrorNode>(
    regex: RegExp,
    getNode: (args: { match: string[]; start: number; end: number }) => Node,
    transact?: (args: { tr: Transaction }) => Transaction,
): KeyBindings {
    // https://github.com/ProseMirror/prosemirror/issues/374#issuecomment-224514332
    // https://discuss.prosemirror.net/t/trigger-inputrule-on-enter/1118/4
    // Some code is copy from prosemirror-inputrules/src/inputrules.js
    return {
        Enter: convertCommand((state: EditorState, dispatch?: DispatchFunction) => {
            // Ensure that the selection is a TextSelection
            if (!(state.selection instanceof TextSelection)) return false

            // Ensure that the selection is cursor (empty selection)
            const $cursor = state.selection.$cursor
            if (!$cursor) return false

            // Get the text before the selection
            const { nodeBefore } = state.selection.$from
            const textBefore = nodeBefore && nodeBefore.isText && nodeBefore.text
            if (!textBefore) return false

            // Execute the regular expression
            const match = regex.exec(textBefore)
            if (!match) return false

            // The range of text which will be replaced
            const [start, end] = [$cursor.pos - match[0].length, $cursor.pos]
            const $start = state.doc.resolve(start)

            const node = getNode({ match, start, end })

            // Ensure that the replacement is available
            if (!$start.node(-1).canReplaceWith($start.index(-1), $start.indexAfter(-1), node.type))
                return false

            let tr: Transaction = state.tr

            // Insert the Prosemirror node
            tr = tr.replaceRangeWith(start, end, node)

            // Run transact
            if (transact) tr = transact({ tr })

            if (dispatch) {
                // To be able to query whether a command is applicable for a given state, without
                // actually executing it, the `dispatch` argument is optional—commands should
                // simply return true without doing anything when they are applicable but no
                // `dispatch` argument is given
                // https://prosemirror.net/docs/guide/#commands
                dispatch(tr)
            }
            return true
        }),
    }
}
