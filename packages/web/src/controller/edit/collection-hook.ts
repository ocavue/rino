import { Draft, produce } from "immer"
import { useCallback, useMemo, useState } from "react"

import { Collection } from "./collection"
import { Note } from "./note"

export function useCollection() {
    const [inboxCollection, setInboxCollection] = useState<Collection>({
        key: "key:inbox",
        name: "Inbox",
        icon: "Inbox",
        notes: [],
        role: "inbox",
    })
    const [trashCollection, setTrashCollection] = useState<Collection>({
        key: "key:trash",
        name: "Trash",
        icon: "Delete",
        notes: [],
        role: "trash",
    })
    const [collectionKey, setCollectionKey] = useState<string | null>("key:inbox")

    const collection = useMemo(() => {
        return collectionKey === inboxCollection.key ? inboxCollection : trashCollection
    }, [collectionKey, trashCollection, inboxCollection])

    const initCollections = useCallback((allNotes: Note[]) => {
        const inboxNotes: Note[] = []
        const trashNotes: Note[] = []

        for (const note of allNotes) {
            if (note.deleted) trashNotes.push(note)
            else inboxNotes.push(note)
        }
        setInboxCollection(
            produce((inboxCollection: Draft<Collection>) => {
                inboxCollection.notes = inboxNotes
            }),
        )
        setTrashCollection(
            produce((trashCollection: Draft<Collection>) => {
                trashCollection.notes = trashNotes
            }),
        )
    }, [])
    const collections = useMemo(() => [inboxCollection, trashCollection], [inboxCollection, trashCollection])

    return {
        collection,
        collections,
        collectionKey,
        initCollections,
        setCollectionKey,
    }
}
