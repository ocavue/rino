import * as icons from "@material-ui/icons"
import { Note } from "./note"

export const collectionIconMap = {
    Inbox: icons.Inbox,
    Delete: icons.Delete,
    Label: icons.Label,
}
export type collectionIconNames = keyof typeof collectionIconMap

export interface Collection {
    key: string
    name: string
    icon: collectionIconNames
    children?: Collection[]
    notes: Note[]
}
