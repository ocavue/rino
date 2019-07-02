import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"

import { defaultMarkdownParser, defaultMarkdownSerializer } from "../../markdown"
import { proseMirrorPlugins } from "../../plugins"

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
        this.textarea = place.appendChild(document.createElement("textarea"))
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
