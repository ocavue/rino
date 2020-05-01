import React, { useMemo, useState } from "react"

import { Note } from "./note"

export const useSearchHook = (
    avaiableNotes: Note[],
    noteKey: string | null,
    setNoteKey: React.Dispatch<React.SetStateAction<string | null>>,
) => {
    const [searchQuery, setSearchQuery] = useState("")

    const searchedNotes: Note[] = useMemo(() => {
        if (searchQuery) {
            const searchedNotes = avaiableNotes.filter((note) => note.content.includes(searchQuery))

            // Side effect:
            // If we can't found the `note` from `visibleNotes` by `noteKey`, then reset `noteKey` to empty in this
            // case so that there is not "invisible selection".
            if (noteKey) {
                for (const note of searchedNotes) {
                    if (note.key === noteKey) return searchedNotes
                }
                setNoteKey(null)
            }
            return searchedNotes
        } else {
            return []
        }
    }, [avaiableNotes, searchQuery, setNoteKey, noteKey])

    return {
        searchQuery,
        setSearchQuery,
        searchedNotes,
    }
}
