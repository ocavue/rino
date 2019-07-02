import { Plugin } from "prosemirror-state"

function addGitHubMarkdownCssClass(): Plugin {
    return new Plugin({
        props: {
            attributes: { class: "markdown-body" },
        },
    })
}

export { addGitHubMarkdownCssClass }
