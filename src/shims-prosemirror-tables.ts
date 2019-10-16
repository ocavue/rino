import { EditorState, Transaction } from "prosemirror-state"

// TODO: Remove this after https://github.com/ProseMirror/prosemirror-tables/pull/89/files being merged
declare module "prosemirror-tables" {
    export function fixTables(state: EditorState, oldState?: EditorState): null | Transaction
}
