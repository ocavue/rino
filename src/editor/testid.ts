import { Plugin } from "prosemirror-state"

export const testidPlugin = new Plugin({
    props: { attributes: { "data-testid": "wysiwyg-mode-textarea" } },
})
