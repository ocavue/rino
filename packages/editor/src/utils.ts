import { convertCommand, DispatchFunction, KeyBindings, ProsemirrorNode } from "@remirror/core"
import { Fragment, NodeRange, Schema } from "prosemirror-model"
import { EditorState, TextSelection, Transaction } from "prosemirror-state"

import { NodeSerializerSpec, ParserRule } from "./transform"

export abstract class MarkdownNodeExtension {
    abstract fromMarkdown: () => readonly ParserRule[]
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
            const parent = $start.node(-1)
            const replaceFromIndex = $start.index(-1)
            const replaceToIndex = $start.indexAfter(-1)
            if (!parent.canReplace(replaceFromIndex, replaceToIndex, Fragment.from(node))) {
                return false
            }

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

/**
 * Iterate all children from a parent node. Yield child node, its
 * offset into this parent node and its index.
 *
 * Same function as node.forEach but with two benefits by using
 * ES6 generator:
 * 1. better readability
 * 2. ability to break the loop
 *
 * @param node The parent node
 * @yields {[node, offset, index]}
 */
export function* iterNode<S extends Schema>(node: ProsemirrorNode<S>): Generator<[ProsemirrorNode<S>, number, number]> {
    const fragment = node.content
    for (let index = 0, offset = 0; index < fragment.childCount; index++) {
        const child = fragment.child(index)
        yield [child, offset, index]
        offset += child.nodeSize
    }
}

/**
 * Iterage all children from a NodeRange object. Yield each child node
 * and its (absolute) position
 *
 * @param range
 * @yields {[node, offset]}
 */
export function* iterNodeRange<S extends Schema>(range: NodeRange<S>): Generator<[ProsemirrorNode<S>, number]> {
    let pos = range.start + 1
    for (const [child, , index] of iterNode(range.parent)) {
        if (index < range.startIndex) continue
        else if (index >= range.endIndex) break
        yield [child, pos]
        pos += child.nodeSize
    }
}
