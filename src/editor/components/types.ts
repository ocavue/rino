import { Note } from "src/controller"

export type InnerEditorProps = {
    className: string
    autoFocus: boolean
    editable: boolean
    content: string
    setContent: (value: string) => void
}

export type OuterEditorProps = {
    autoFocus: boolean
    note: Note
    setNoteContent: (content: string) => void
}
