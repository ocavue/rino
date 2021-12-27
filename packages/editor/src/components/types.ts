import { AnyExtension, ProsemirrorNode, RemirrorManager } from "@remirror/core"

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

export type EditorState =
    | {
          mode: Mode
          delegate: EditorDelegate
          note: Note
          hasUnsavedChanges: boolean

          initialDoc: ProsemirrorNode
          error: null
      }
    | {
          mode: Mode
          delegate: EditorDelegate
          note: Note
          hasUnsavedChanges: boolean

          initialDoc: null
          error: Error
      }
