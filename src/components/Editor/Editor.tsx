import { BaseView, MarkdownView, ProseMirrorView } from "src/editor"
import { Note } from "src/controller"
import { Theme, createStyles, makeStyles } from "@material-ui/core"
import { debounce } from "lodash"
import { isMac } from "src/utils"
import React from "react"
import clsx from "clsx"

type EditorProps = {
    autoFocus: boolean
    note: Note
    setNoteContent: (content: string) => void
}

type InnerEditorProps = EditorProps & {
    classes: Record<never, string>
}

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({})
})

const metaKey = isMac() ? "metaKey" : "ctrlKey"

class InnerEditor extends React.Component<InnerEditorProps> {
    private editorRef: React.RefObject<HTMLDivElement>
    private view: BaseView | null
    private note: Note
    private update: () => void
    private handleKeydown: (event: KeyboardEvent) => void
    private classes: Record<never, string>
    private sourceCodeMode: boolean
    private setNoteContent: (content: string) => void

    constructor(props: InnerEditorProps) {
        super(props)
        this.editorRef = React.createRef<HTMLDivElement>()
        this.view = null
        this.note = props.note
        this.setNoteContent = props.setNoteContent
        this.update = () => {}
        this.handleKeydown = () => {}
        this.classes = props.classes
        this.sourceCodeMode = false
    }

    componentDidMount() {
        this.createView(ProseMirrorView, this.note.content)

        this.update = debounce(() => {
            console.log("Updating")
            if (this.view) {
                this.setNoteContent(this.view.content)
            }
        }, 1000)

        this.handleKeydown = (event: KeyboardEvent) => {
            if (event[metaKey] && event.code === "Slash") {
                console.debug("meta + / has been pressed")
                this.switchView()
            } else {
                this.update()
            }
        }

        window.addEventListener("keydown", this.handleKeydown)
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKeydown)
        if (this.view) {
            this.setNoteContent(this.view.content)
            this.view.destroy()
        }
    }

    createView(View: typeof MarkdownView | typeof ProseMirrorView, content: string) {
        if (this.view) this.view.destroy()
        try {
            console.log("creating view")
            const ref = this.editorRef.current
            if (!ref) throw new Error("ref is empty")
            this.view = new View(ref, content)
            this.view.focus()
        } catch (error) {
            setTimeout(() => alert(`Failed to load markown content:\n${error}`), 0)
        }
    }

    switchView() {
        this.sourceCodeMode = !this.sourceCodeMode
        const View = this.sourceCodeMode ? MarkdownView : ProseMirrorView
        const content = this.view?.content || this.note.content
        this.createView(View, content)
    }

    render() {
        return (
            <div
                ref={this.editorRef}
                className={clsx(this.classes, "markdown-body", "editor")}
                data-testid="editor"
            />
        )
    }
}

export const Editor: React.FC<EditorProps> = ({ autoFocus, note, setNoteContent }) => {
    const classes = useStyles()
    return (
        <InnerEditor
            autoFocus={autoFocus}
            note={note}
            setNoteContent={setNoteContent}
            classes={classes}
        />
    )
}
