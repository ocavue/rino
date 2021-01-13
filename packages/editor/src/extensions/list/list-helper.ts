import { range } from "lodash"
import { Fragment, Node, NodeType, Slice } from "prosemirror-model"
import { EditorState, NodeSelection, Selection, Transaction } from "prosemirror-state"
import { canSplit } from "prosemirror-transform"

import { all } from "@rino.app/common"

class AssertError extends Error {}

function assert(result: boolean, msg = "") {
    if (!result) throw new AssertError(msg)
}

// Build a command that splits a non-empty textblock at the top level
// of a list item by also splitting that list item.
export function splitListItem(paragraphType: NodeType, rinoCheckboxType: NodeType, rinoListItemType: NodeType) {
    return function (state: EditorState, dispatch?: (tr: Transaction) => void): boolean {
        const { $from, $to, node } = state.selection as NodeSelection
        if ((node && node.isBlock) || $from.depth < 2 || !$from.sameParent($to)) return false

        const parent: Node = $from.parent // $from.parent === $from.node(0) === $from.node($from.depth)
        const listItem: Node = $from.node(-1)
        if (listItem.type != rinoListItemType) return false
        const checkbox: Node | null = listItem.firstChild?.type == rinoCheckboxType ? listItem.firstChild : null

        if (parent.content.size === 0) {
            let tr = state.tr
            // In an empty block. If this is a nested list, the wrapping
            // list item should be split. Otherwise, bail out and let next
            // command handle lifting.

            /*
            list                        $from.node(-4)
                li
                    checkbox?
                    p
                li                      $from.node(-3)
                    list                $from.node(-2)
                        li              $from.node(-1)
                            checkbox?
                            p           $from.parent
            */
            const isEmptyListItem = listItem.childCount <= (checkbox ? 2 : 1)
            if (isEmptyListItem) {
                if (dispatch) {
                    const oldList: Node = $from.node(-2)
                    const listType = oldList.type
                    assert(["rinoOrderedList", "rinoBulletList"].includes(oldList.type.name), oldList.type.name)
                    const listItemIndex = $from.index(-2)
                    const newListItems1 = range(0, listItemIndex).map((index) => oldList.child(index))

                    // A note about lodash's `range` function: `range(1, 0)` will return `[1]`. I must use `range(1, 0, 1)` to return `[]`.
                    const newListItems2 = range(listItemIndex + 1, oldList.childCount, 1).map((index) => oldList.child(index))

                    assert(all(newListItems1.map((node) => node.type.name === "rinoListItem")))
                    assert(all(newListItems2.map((node) => node.type.name === "rinoListItem")))
                    assert(
                        newListItems1.length + newListItems2.length + 1 === oldList.childCount,
                        `newListItems1: ${newListItems1.length}; newListItems2: ${newListItems2.length}; oldList: ${oldList.childCount}`,
                    )

                    const newList1 = newListItems1.length ? listType.createChecked(null, newListItems1) : undefined
                    const newList2 = newListItems2.length ? listType.create(null, newListItems2) : undefined
                    const newParagraph = paragraphType.create(null)

                    const nodes: Node[] = []
                    for (const node of [newList1, newParagraph, newList2]) if (node) nodes.push(node)
                    const wrap = Fragment.fromArray(nodes)
                    const slice = new Slice(wrap, 0, 0)
                    tr = tr.replace($from.before(-2), $from.after(-2), slice)
                    const newPos = $from.pos + (checkbox ? -1 : 0)
                    tr.setSelection(Selection.near(tr.doc.resolve(newPos)))
                    dispatch(tr.scrollIntoView())
                }
                return true
            } else {
                return false
            }
        } else {
            const nextType = $to.pos === $from.end() ? listItem.contentMatchAt(0).defaultType : null
            let tr = state.tr.delete($from.pos, $to.pos)
            const types = nextType && [null, { type: nextType }]
            if (!canSplit(tr.doc, $from.pos, 2, types)) return false
            tr = tr.split($from.pos, 2, types)
            if (checkbox) {
                /*
                Before splitting:
                    [0]                      doc                             [10]
                        [1]                  rinoBulletList              [9]
                            [2]              rinoListItem            [8]
                                [3]          rinoCheckbox        [3]
                                [4]          paragraph           [7]
                                    [4]      text (2 chars)  [6]
                $from.$pos === 5

                After splitting:
                    [0]                     doc                             [15]
                        [1]                 rinoBulletList              [14]
                            [2]             rinoListItem            [7]
                                [3]         rinoCheckbox        [3]
                                [4]         paragraph           [6]
                                    [4]     text (1 char)   [5]
                            [8]             rinoListItem            [13]
                                [9]         rinoCheckbox        [9]
                                [10]        paragraph           [12]
                                    [10]    text (1 char)   [11]
                The checkbox should be inserted into position 8 === $from.$pos + 3
                */
                tr = tr.insert($from.pos + 3, rinoCheckboxType.createChecked())
            }

            if (dispatch) dispatch(tr.scrollIntoView())
            return true
        }
    }
}
