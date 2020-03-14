import { Note } from "./note"

export type collectionIconNames = "Inbox" | "Delete"

export interface Collection {
    key: string
    name: string
    icon: collectionIconNames
    children?: Collection[]
    notes: Note[]
}
