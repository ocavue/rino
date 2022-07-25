import { css } from "@emotion/css"
import { ApplySchemaAttributes, ExtensionTag, KeyBindings, NodeExtension, NodeExtensionSpec, NodeSpecOverride } from "@remirror/core"

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

    createKeymap(): KeyBindings {
        return createListItemKeymap(this.type)
    }
}
