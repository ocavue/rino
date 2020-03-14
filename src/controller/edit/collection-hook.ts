import { Collection } from "./collection"
import { Draft, produce } from "immer"
import { Note } from "./note"
import { createContainer } from "unstated-next"
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
                    collections[0].notes = []
                    collections[1].notes = []

                    for (const note of allNotes) {
                        if (note.deleted) collections[1].notes.push(note)
                        else collections[0].notes.push(note)
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

export const CollectionContainer = createContainer(useCollection)
