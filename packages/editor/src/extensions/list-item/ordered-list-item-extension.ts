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
} from "@remirror/core"

import { createAutoJoinListPlugin } from "./auto-join-list-plugin"
import { createElement as h } from "./dom-utils"
import { createListItemKeymap } from "./list-item-keymap"

const orderedListItem = css`
    /* border: 1px solid red; */
    padding: 0;
    margin: 2px;

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

    & > .list-task-mark:before {
        content: "[ ]";
    }

    & > .list-content-container {
        flex: 1;
    }
`

interface ItemAttributes {
    kind: "bullet" | "ordered" | "task"
    checked: boolean
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

            let isNested: boolean | null = null

            const updateMark = (node: ProsemirrorNode) => {
                const _isNested = node.content.firstChild?.type === this.type

                if (_isNested !== isNested) {
                    isNested = _isNested
                    mark.style.opacity = _isNested ? "0.2" : ""
                }

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
                            markClass += " list-ordered-mark"
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
}
