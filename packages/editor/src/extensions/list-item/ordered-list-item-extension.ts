import { css } from "@emotion/css"
import {
    ApplySchemaAttributes,
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

import { createListItemKeymap } from "./list-item-keymap"

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
                console.warn("toDOM:")
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

                    console.warn("update:")
                    updateMark(node)
                    return true
                },
            }
        }
    }

    createKeymap(): KeyBindings {
        return createListItemKeymap(this.type)
    }
}
