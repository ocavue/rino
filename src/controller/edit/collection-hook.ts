import { Collection } from "./collection"
import { Draft, produce } from "immer"
import { Note } from "./note"
import { useCallback, useMemo, useState } from "react"

function useCollections() {
    return useState<Collection[]>([
        {
            key: "_inbox",
            name: "Inbox",
            icon: "Inbox",
            notes: [],
        },
        {
            key: "_trash",
            name: "Trash",
            icon: "Delete",
            notes: [],
        },
    ])
}

function useCollectionKey() {
    return useState<string | null>("_inbox")
}

export function useCollection() {
    const [collections, setCollections] = useCollections()
    const [collectionKey, setCollectionKey] = useCollectionKey()
    const collection = useMemo(
        () => collections.find(collection => collection.key === collectionKey),
        [collections, collectionKey],
    )
    const initCollections = useCallback(
        (allNotes: Note[]) => {
            setCollections(
                produce((collections: Draft<Collection[]>) => {
                    const [inbox, trash] = collections

                    inbox.notes = []
                    trash.notes = []

                    for (const note of allNotes) {
                        if (note.deleted) trash.notes.push(note)
                        else inbox.notes.push(note)
                    }
                }),
            )
        },
        [setCollections],
    )

    return {
        collection,
        collections,
        collectionKey,
        initCollections,
        setCollectionKey,
    }
}
