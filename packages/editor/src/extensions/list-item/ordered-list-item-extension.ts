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
import { NodeType } from "@remirror/pm/dist-types/model"
import { InputRule } from "@remirror/pm/inputrules"
import { findWrapping } from "@remirror/pm/transform"

import { createAutoJoinListPlugin } from "./auto-join-list-plugin"
import { createElement as h } from "./dom-utils"
import { createListItemKeymap } from "./list-item-keymap"

const orderedListItem = css`
    /* border: 1px solid red; */
    padding: 0;
    /* margin: 2px; */

    background-color: rgba(100, 100, 100, 0.1);

    display: flex;

    counter-reset: remirror-list-number;
    & + & {
        counter-reset: none;
        /* border: 1px solid blue; */
    }

    & > .list-mark-container:before {
        content: "";
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

    & > .list-ordered-mark:before {
        counter-increment: remirror-list-number;
        content: counter(remirror-list-number, decimal) ".";
    }

    & > .list-bullet-mark:before {
        content: "-";
    }

    & > .list-task-checked-mark:before {
        content: "[x]";
    }
    & > .list-task-unchecked-mark:before {
        content: "[ ]";
    }

    & > .list-content-container {
        flex: 1;
    }
`

interface ItemAttributes {
    kind: "bullet" | "ordered" | "task"
    checked?: boolean
}

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
            attrs: {
                kind: {
                    default: "bullet",
                },
                checked: {
                    default: false,
                },
            },
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
            const mark = h("div", { class: "list-mark-container" })

            const container = h("div", { class: "list-content-container" })

            const outer = h("div", { class: orderedListItem }, mark, container)

            const updateMark = (node: ProsemirrorNode) => {
                const isNested = node.content.firstChild?.type === this.type

                const attrs = node.attrs as ItemAttributes

                let markClass = "list-mark-container"
                if (!isNested) {
                    switch (attrs.kind) {
                        case "ordered":
                            markClass += " list-ordered-mark"
                            break
                        case "bullet":
                            markClass += " list-bullet-mark"
                            break
                        case "task":
                            markClass += attrs.checked ? " list-task-checked-mark" : " list-task-unchecked-mark"
                            break
                    }
                }

                mark.className = markClass
            }

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
        return createAutoJoinListPlugin()
    }

    createInputRules(): InputRule[] {
        const bulletRegexp = /^\s?([*+-])\s$/
        const orderedRegexp = /^\s?(\d+)\.\s$/
        const taskRegexp = /^\s?\[([Xx\s]?)\]\s$/

        return [
            wrappingListInputRule(bulletRegexp, this.type, { kind: "bullet" }),
            wrappingListInputRule(orderedRegexp, this.type, { kind: "ordered" }),
            wrappingListInputRule(taskRegexp, this.type, (match) => ({ kind: "task", checked: ["x", "X"].includes(match[1]) })),
        ]
    }
}

function wrappingListInputRule(
    regexp: RegExp,
    listType: NodeType,
    getAttrs: ItemAttributes | ((matches: RegExpMatchArray) => ItemAttributes),
) {
    return new InputRule(regexp, (state, match, start, end): Transaction | null => {
        const tr = state.tr
        tr.deleteRange(start, end)

        const attrs = typeof getAttrs === "function" ? getAttrs(match) : getAttrs

        const $pos = tr.selection.$from
        if ($pos.depth >= 2 && $pos.node(-1).type === listType) {
            const foundItem = $pos.node(-1)
            let needUpdate = false
            for (const [key, value] of Object.entries(attrs)) {
                if (foundItem.attrs[key] !== value) {
                    needUpdate = true
                    break
                }
            }

            if (needUpdate) {
                tr.setNodeMarkup($pos.before(-1), undefined, { ...foundItem.attrs, ...attrs })
                return tr
            } else {
                return null
            }
        } else {
            const $start = tr.doc.resolve(start)
            const range = $start.blockRange()
            if (!range) return null
            const wrapping = findWrapping(range, listType, attrs)
            if (!wrapping) return null
            tr.wrap(range, wrapping)
            return tr
        }
    })
}
