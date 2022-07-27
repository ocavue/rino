import { css } from "@emotion/css"
import {
    ApplySchemaAttributes,
    CreateExtensionPlugin,
    EditorView,
    ExtensionTag,
    KeyBindings,
    NodeExtension,
    NodeExtensionSpec,
    NodeSpecOverride,
    NodeView,
    NodeViewMethod,
    ProsemirrorNode,
    Transaction,
} from "@remirror/core"
import { canJoin } from "@remirror/pm/transform"

import { createListItemKeymap } from "./list-item-keymap"
import { isListItemNode } from "./list-utils"

const orderedListItem = css`
    border: 1px solid red;
    padding: 0;
    margin: 2px;

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
            toDOM: (node) => {
                const isNested = node.content.firstChild?.type === this.type

                return [
                    "div",
                    { class: `${orderedListItem}` },

                    // the container for the list item markers
                    ["div", { class: `list-mark-container`, style: isNested ? "opacity: 0.2;" : undefined }],

                    // the container for the list item content
                    ["div", { class: `list-content-container` }, 0],
                ]
            },
        }
    }

    createNodeViews(): NodeViewMethod {
        return (node: ProsemirrorNode, view: EditorView, getPos: (() => number) | boolean): NodeView => {
            const outer = document.createElement("div")
            outer.className = orderedListItem

            const mark = document.createElement("div")
            mark.className = `list-mark-container`

            let isNested: boolean | null = null

            const updateMark = (node: ProsemirrorNode) => {
                const _isNested = node.content.firstChild?.type === this.type

                if (_isNested !== isNested) {
                    isNested = _isNested
                    mark.style.opacity = _isNested ? "0.2" : ""
                }
            }

            const container = document.createElement("div")
            container.className = "list-content-container"

            outer.appendChild(mark)
            outer.appendChild(container)

            updateMark(node)

            return {
                dom: outer,
                contentDOM: container,
                update: (node: ProsemirrorNode) => {
                    if (node.type !== this.type) {
                        return false
                    }

                    updateMark(node)
                    return true
                },
            }
        }
    }

    createKeymap(): KeyBindings {
        return createListItemKeymap(this.type)
    }

    createPlugin(): CreateExtensionPlugin {
        return {
            appendTransaction: (transactions, oldState, newState): Transaction | null => {
                const ranges: number[] = []

                for (const tr of transactions) {
                    if (!tr.isGeneric) return null

                    for (const map of tr.mapping.maps) {
                        for (let i = 0; i < ranges.length; i++) ranges[i] = map.map(ranges[i])
                        map.forEach((oldStart, oldEnd, newStart, newEnd) => ranges.push(newStart, newEnd))
                    }
                }

                const rangeMap = new Map<number, number>()
                for (let i = 0; i < ranges.length; i += 2) {
                    rangeMap.set(ranges[i], ranges[i + 1])
                }

                // Add all node boundaries to the range map
                for (const pos of ranges) {
                    const $pos = newState.doc.resolve(pos)
                    for (let depth = $pos.depth; depth >= 1; depth--) {
                        const before = $pos.before(depth)
                        const after = $pos.after(depth)

                        if ((rangeMap.get(before) || -1) >= after) {
                            break
                        }

                        rangeMap.set(before, after)
                    }
                }

                // Figure out which joinable points exist inside those ranges,
                // by checking all node boundaries in their parent nodes.
                const joinDpeths: Map<number, number> = new Map()

                for (const [from, to] of rangeMap.entries()) {
                    const $from = newState.doc.resolve(from)

                    const depth = $from.sharedDepth(to)

                    const parent = $from.node(depth)

                    for (let index = $from.indexAfter(depth), pos = $from.after(depth + 1); pos <= to; ++index) {
                        const after = parent.maybeChild(index)
                        if (!after) break
                        if (index && !joinDpeths.has(pos)) {
                            const before = parent.child(index - 1)
                            if (before.type === after.type) {
                                const joinDepth = isJoinable(before, after)
                                if (joinDepth) {
                                    joinDpeths.set(pos, joinDepth)
                                }
                            }
                        }
                        pos += after.nodeSize
                    }
                }

                // Join the joinable points
                let joint = false
                const tr = newState.tr
                for (let [pos, joinDepth] of [...joinDpeths.entries()].sort()) {
                    while (joinDepth) {
                        if (!canJoin(tr.doc, pos)) break

                        tr.join(pos)
                        joint = true
                        joinDepth--
                        pos = tr.mapping.map(pos)
                    }
                }

                return joint ? tr : null
            },
        }
    }
}

function isJoinable(before: ProsemirrorNode | null, after: ProsemirrorNode | null): number {
    let joinDepth = 0
    while (isListItemNode(before) && isListItemNode(after) && isListItemNode(after.firstChild)) {
        joinDepth++
        before = before.lastChild
        after = after.firstChild
    }
    return joinDepth
}
