import { SetStateAction, useCallback, useEffect, useMemo } from "react"
import { createContainer } from "unstated-next"

import { useCollection } from "./collection-hook"
import { Note } from "./note"
import { useNote } from "./note-hook"
import { useSearchHook } from "./search-hook"

function useEditHook() {
    const {
        notes,
        noteKey,
        setNoteKey,
        setNoteContent,
        removeAllNotes,
        fetchNotes,
        deleteNote,
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

    const { searchQuery, setSearchQuery, searchedNotes } = useSearchHook(notes, noteKey, setNoteKey)

    // `visibleNotes` are notes listed in the drawer
    const visibleNotes = useMemo(() => {
        if (searchQuery) {
            return searchedNotes
        } else {
            return collection.notes || []
        }
    }, [searchQuery, searchedNotes, collection])

    // The note opened in the editor
    const note: Note | null = useMemo(() => {
        if (noteKey) {
            return visibleNotes.find((note) => note.key === noteKey) || null
        } else {
            return null
        }
    }, [visibleNotes, noteKey])

    useEffect(() => {
        initCollections(notes)
    }, [notes, initCollections])

    return {
        // note
        note,
        notes,
        noteKey,
        visibleNotes,
        searchedNotes,
        setNoteKey,
        setNoteContent,
        removeAllNotes,
        fetchNotes,
        deleteNote,
        resetNotes,
        createServerNote,
        createLocalNote,

        // collection
        collection,
        collections,
        collectionKey,
        setCollectionKey,

        // search
        searchQuery,
        setSearchQuery,
    }
}

export const EditContainer = createContainer(useEditHook)
