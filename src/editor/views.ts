import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"

import { Plugin } from "prosemirror-state"
import { history } from "prosemirror-history"
import { dropCursor } from "prosemirror-dropcursor"
import { tableEditing } from "prosemirror-tables"

import { buildKeymaps } from "./keymap"
import { decorationPlugin } from "./decoration"
import { buildMdInputRules } from "./input-rule"
import { testidPlugin } from "./testid"
import { tableMenuPlugin, tableHeigthlightPlugin } from "./table"
import { defaultMarkdownParser } from "./parser"
import { defaultMarkdownSerializer } from "./serializer"
import { checkboxPlugin } from "./checkbox"

import "../../node_modules/prosemirror-tables/style/tables.css"
import "../../node_modules/prosemirror-view/style/prosemirror.css"
import "../style/table.sass"

const proseMirrorPlugins: Plugin[] = [
    history(),
    dropCursor(),
    ...buildKeymaps(),
    buildMdInputRules(),
    testidPlugin,
    checkboxPlugin,
    decorationPlugin,
    tableMenuPlugin,
    tableHeigthlightPlugin,
    tableEditing(),
]

abstract class BaseView {
    public constructor() {}
    abstract get content(): string
    abstract focus(): void
    abstract destroy(): void
}

class MarkdownView extends BaseView {
    private textarea: HTMLTextAreaElement

    public constructor(place: HTMLElement, content: string) {
        super()
        const textarea = document.createElement("textarea")
        textarea.setAttribute("data-testid", "source-code-mode-textarea")
        this.textarea = place.appendChild(textarea)
        this.textarea.value = content
    }

    public get content() {
        return this.textarea.value
    }
    public focus() {
        this.textarea.focus()
    }
    public destroy() {
        this.textarea.remove()
    }
}

class ProseMirrorView extends BaseView {
    private view: EditorView

    public constructor(place: HTMLElement, content: string) {
        super()
        if (process.env.NODE_ENV === "development") {
            if (content.trim() === "HOOK:FAILED_TO_INIT_PROSEMIRROR_VIEW") {
                throw new Error("Found error hook for testing")
            }
        }
        this.view = new EditorView(place, {
            state: EditorState.create({
                doc: defaultMarkdownParser.parse(content),
                plugins: proseMirrorPlugins,
            }),
        })
        if (process.env.VUE_APP_PROSEMIRROR_DEV_TOOLS) {
            // Webpack will remove this block in production mode
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const prosemirrorDevTools = require("prosemirror-dev-tools")
            prosemirrorDevTools.applyDevTools(this.view)
        }
    }

    public get content() {
        return defaultMarkdownSerializer.serialize(this.view.state.doc)
    }
    public focus() {
        this.view.focus()
    }
    public destroy() {
        this.view.destroy()
    }
}

export { BaseView, MarkdownView, ProseMirrorView }
