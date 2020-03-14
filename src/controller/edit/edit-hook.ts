import { SetStateAction, useCallback } from "react"
import { createContainer } from "unstated-next"
import { useCollection } from "./collection-hook"
import { useNote } from "./note-hook"

function useEditHook() {
    const {
        note,
        notes,
        noteKey,
        setNoteKey,
        setNoteContent,
        removeAllNotes,
        fetchNotes,
        removeNote,
        resetNotes,
        createServerNote,
        createLocalNote,
    } = useNote()

    const {
        collection,
        collections,
        collectionKey,
        initCollections,
        setCollectionKey: _setCollectionKey,
    } = useCollection()

    const setCollectionKey = useCallback(
        // Don't select any note after switching collection
        (collectionKey: SetStateAction<string | null>) => {
            setNoteKey(null)
            _setCollectionKey(collectionKey)
        },
        [setNoteKey, _setCollectionKey],
    )

    return {
        // note
        note,
        notes,
        noteKey,
        setNoteKey,
        setNoteContent,
        removeAllNotes,
        fetchNotes,
        removeNote,
        resetNotes,
        createServerNote,
        createLocalNote,

        // collection
        collection,
        collections,
        collectionKey,
        initCollections,
        setCollectionKey,
    }
}

export const EditContainer = createContainer(useEditHook)
