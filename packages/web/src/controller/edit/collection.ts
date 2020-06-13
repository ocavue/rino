import * as icons from "@material-ui/icons"

import { Note } from "./note"

export const collectionIconMap = {
    Inbox: icons.Inbox,
    Delete: icons.Delete,
    Label: icons.Label,
}
export type CollectionIconName = keyof typeof collectionIconMap
export type CollectionRole = "inbox" | "trash" | "child"

export interface Collection {
    key: string
    name: string
    role: CollectionRole
    icon: CollectionIconName
    children?: Collection[]
    notes: Note[]
}
