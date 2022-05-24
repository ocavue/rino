import { css } from "@emotion/css"
import { ApplySchemaAttributes, ExtensionTag, KeyBindings, NodeExtension, NodeExtensionSpec, NodeSpecOverride } from "@remirror/core"
import { Fragment, Slice } from "prosemirror-model"
import { Selection } from "prosemirror-state"
import { canSplit, liftTarget } from "prosemirror-transform"

import { isBlockNodeSelection, isLastChild, isListItemType } from "./list-utils"

const orderedListItem = css`
    border: 1px solid red;
    padding: 4px;
    margin: 4px;

    display: flex;

    counter-reset: remirror-list-number;
    & + & {
        counter-reset: none;
        border: 1px solid blue;
    }

    & > .list-mark-container:before {
        counter-increment: remirror-list-number;
        content: counter(remirror-list-number, decimal) ".";

        /* margin-bottom: 10px; */
        min-width: 2rem;
        box-sizing: border-box;
        padding-right: 0.5rem;
        /* height: 35px; */
        display: inline-flex;
        align-items: center;
        justify-content: flex-end;
        font-size: 16px;
        /* overflow: visible; */
        background-color: #ff89a5;
        /* border-radius: 50%; */
        /* color: #fff; */
    }

    & > .list-content-container {
        flex: 1;
    }
`

export class OrderedListItemExtension extends NodeExtension {
    static disableExtraAttributes = true

    get name() {
        return "orderedListItem"
    }

    createTags() {
        return [ExtensionTag.Block]
    }

    createNodeSpec(extra: ApplySchemaAttributes, override: NodeSpecOverride): NodeExtensionSpec {
        return {
            content: "block+",
            // TODO: If I change the content as follows, it breaks the `Enter` keybind because of `canSplit` return false.
            // content: "paragraph block*",
            defining: true,
            toDOM(node) {
                return [
                    "div",
                    { class: `${orderedListItem}` },

                    // the container for the list item markers
                    ["div", { class: `list-mark-container` }],

                    // the container for the list item content
                    ["div", { class: `list-content-container` }, 0],
                ]
            },
        }
    }

    createKeymap(): KeyBindings {
        return {
            Enter: (props): boolean => {
                const itemType = this.type
                const { tr, dispatch } = props
                const { selection } = props.state
                const { $from, $to } = selection

                if (!selection.empty) return false

                if (isBlockNodeSelection(selection)) return false

                if (!$from.sameParent($to)) return false

                if ($from.depth < 2) return false

                const parent = $from.parent
                const currItem = $from.node(-1)
                if (currItem.type !== this.type) {
                    return false
                }

                const parentIsEmpty = parent.content.size === 0
                const isLastItem = isLastChild($from, -1)
                if (parentIsEmpty && isLastItem) {
                    // In an empty block. If this is a nested list, the wrapping
                    // list item should be split. Otherwise, bail out and let next
                    // command handle lifting.
                    const parentItem = $from.depth > 2 && $from.node(-2)
                    if (!(parentItem && isListItemType(parentItem.type) && isLastChild($from, -2))) {
                        return false
                    }

                    if (dispatch) {
                        let wrap = Fragment.empty
                        const depthBefore = $from.index(-1) ? 1 : $from.index(-2) ? 2 : 3
                        // Build a fragment containing empty versions of the structure
                        // from the outer list item to the parent node of the cursor
                        for (let d = $from.depth - depthBefore; d >= $from.depth - 2; d--) wrap = Fragment.from($from.node(d).copy(wrap))
                        // TODO: I don't understand code here

                        // console.debug("wrap:", wrap)

                        const depthAfter =
                            $from.indexAfter(-1) < $from.node(-2).childCount ? 1 : $from.indexAfter(-2) < $from.node(-3).childCount ? 2 : 3
                        // console.debug("depthAfter:", depthAfter)

                        // Add a second list item with an empty default start node
                        // @ts-expect-error Fragment.from should accept null and undefined
                        wrap = wrap.append(Fragment.from(itemType.createAndFill()))
                        const start = $from.before($from.depth - (depthBefore - 1))
                        tr.replace(start, $from.after(-depthAfter), new Slice(wrap, 3 - depthBefore, 0))
                        let sel = -1
                        tr.doc.nodesBetween(start, tr.doc.content.size, (node, pos) => {
                            if (sel > -1) return false
                            if (node.isTextblock && node.content.size == 0) sel = pos + 1
                        })
                        if (sel > -1) {
                            tr.setSelection(Selection.near(tr.doc.resolve(sel)))
                        }
                        dispatch(tr.scrollIntoView())
                    }
                    return true
                }

                // If the cursor is not at the end of the parent list item, don't split the list item.
                if ($from.index(-1) !== 0) {
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
            },

            "Shift-Tab": (props): boolean => {
                const itemType = this.type
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
}
