import { AnyExtension, ProsemirrorNode, RemirrorManager } from "@remirror/core"

import { FileHandler } from "../extensions"

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

export type WysiwygOptions = {
    isTesting?: boolean
    imageFileHandler?: FileHandler
}

type BaseEditorState = {
    mode: Mode
    delegate: EditorDelegate
    note: Note
    hasUnsavedChanges: boolean
}

export type EditorState = BaseEditorState &
    (
        | {
              initialDoc: ProsemirrorNode
              error: null
          }
        | {
              initialDoc: null
              error: Error
          }
    )
