import { SetStateAction, useCallback } from "react"
import { createContainer } from "unstated-next"
import { useCollection } from "./collection-hook"
import { useNote } from "./note-hook"

function useEditHook() {
    const {
        note,
        notes,
        noteKey,
        setNoteKey: _setNoteKey,
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
        setCollectionKey,
    } = useCollection()

    const setNoteKey = useCallback(
        (noteKey: SetStateAction<string | null>) => {
            _setNoteKey(noteKey)
            setCollectionKey(null)
        },
        [_setNoteKey, setCollectionKey],
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
