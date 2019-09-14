import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"

import { Plugin } from "prosemirror-state"
import { history } from "prosemirror-history"
import { gapCursor } from "prosemirror-gapcursor"
import { dropCursor } from "prosemirror-dropcursor"

import { buildKeymaps } from "./keymap"
import { decorationPlugin } from "./decoration"
import { buildMdInputRules } from "./input-rule"
import { testidPlugin } from "./testid"

import { defaultMarkdownParser } from "./parser"
import { defaultMarkdownSerializer } from "./serializer"

const proseMirrorPlugins: Plugin[] = [
    history(),
    dropCursor(),
    gapCursor(), // TODO You'll probably want to load style/gapcursor.css, which contains basic styling for the simulated cursor (as a short, blinking horizontal stripe).
    ...buildKeymaps(),
    buildMdInputRules(),
    testidPlugin,
    decorationPlugin,
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
        this.view = new EditorView(place, {
            state: EditorState.create({
                doc: defaultMarkdownParser.parse(content),
                plugins: proseMirrorPlugins,
            }),
        })
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
