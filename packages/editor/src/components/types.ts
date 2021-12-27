import { AnyExtension, ProsemirrorNode, RemirrorManager } from "@remirror/core"
import { Container } from "unstated-next"

export type EditorProps = {
    className: string
    autoFocus: boolean
    editable: boolean
    initialContent: string
    onContentSaveDelay: number
    onContentSave: (content: string) => void
    onContentEdit: () => void
    beforeUnmount: (content?: string) => void
    enableDevTools: boolean
}

export type DrawerActivityContainer = Pick<Container<{ drawerActivity: boolean }>, "useContainer">

export type StringToDoc = (content: string) => ProsemirrorNode
export type DocToString = (doc: ProsemirrorNode) => string

export type EditorDelegate<E extends AnyExtension = any> = {
    manager: RemirrorManager<E>
    stringToDoc: StringToDoc
    docToString: DocToString
}

export interface Note {
    content: string
    deleted: boolean
}

export enum Mode {
    WYSIWYG = 1,
    SOURCE_CODE = 2,
}

export type EditorState = {
    mode: Mode
    delegate: EditorDelegate
    initialDoc: ProsemirrorNode
    note: Note
    hasUnsavedChanges: boolean
    error: string | null
}
