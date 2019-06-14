import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"

import { defaultMarkdownParser, defaultMarkdownSerializer } from "../markdown"
import { proseMirrorPlugins } from '../plugins'

let content: string
content = `
# h1
## h2
### h3
#### h4
##### h5
###### h6

\`inlinc code\` *em* **strong** ~~delete~~ text

text *1 1 **3 3** 1 1*, **2 2 *3 3* 2 2**

[link](https://github.com) text <https://github.com> text

![Image](https://via.placeholder.com/150)

> quota *em* \`code\`
>
> > quota *em* \`code\`
> >
> > > quota *em* \`code\`
> >
> > quota *em* \`code\`
>
> quota *em* \`code\`

----

1. ordered list
2. ordered list
3. ordered list

- bullet list
- bullet list
- bullet list

\`\`\`
"Hello World!"
\`\`\`

\`\`\`JavaScript
console.log("Hello World!")
\`\`\`
`

abstract class BaseView {
    public constructor() { }
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
    public focus() { this.textarea.focus() }
    public destroy() { this.textarea.remove() }
}

class ProseMirrorView extends BaseView {
    private view: EditorView

    public constructor(place: HTMLElement, content: string) {
        super()
        this.view = new EditorView(place, {
            state: EditorState.create({
                doc: defaultMarkdownParser.parse(content),
                plugins: proseMirrorPlugins,
            })
        })
    }

    public get content() {
        return defaultMarkdownSerializer.serialize(this.view.state.doc)
    }
    public focus() { this.view.focus() }
    public destroy() { this.view.destroy() }
}


function main() {
    let place = document.body
    let view: BaseView = new ProseMirrorView(place, content)

    let checkbox = document.getElementById('checkbox')
    if (!checkbox) throw new Error("Can't find checkbox")
    checkbox.addEventListener("change", () => {
        let isSourceMode = (checkbox as HTMLInputElement).checked
        console.log("Source code mode:", isSourceMode)
        let View = isSourceMode ? MarkdownView : ProseMirrorView
        let content = view.content
        view.destroy()
        view = new View(place, content)
        view.focus()
    })
}

main()
