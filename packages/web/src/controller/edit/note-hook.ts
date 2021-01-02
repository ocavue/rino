import { Draft, produce } from "immer"
import { sortBy } from "lodash"
import { useCallback, useMemo, useRef, useState } from "react"

import { docs } from "../docs"
import { notesCollection } from "../firebase/app"
import { Note, NoteType } from "./note"

export type Notes = Note[]

function useNotes() {
    return useState<Notes>([])
}
type SetNotes = ReturnType<typeof useNotes>[1]
function useNoteKey() {
    return useState<string | null>(null)
}
type NoteKey = ReturnType<typeof useNoteKey>[0]
type SetNoteKey = ReturnType<typeof useNoteKey>[1]

function useFetchNotes(setNotes: SetNotes) {
    const isFirstFetchRef = useRef(true)
    const fetchNotesFromServerOrCache = useCallback(
        async function fetchNotesFromServerOrCache(uid: string) {
            const isFirstFetch = isFirstFetchRef.current
            const query = notesCollection.where("uid", "==", uid)
            const snapshot = await (async () => {
                if (isFirstFetch) {
                    isFirstFetchRef.current = false
                    const snapshot = await query.get({ source: "cache" })
                    if (snapshot.docs.length === 0) {
                        // If the cache is empty, try to fetch the data from the server
                        return await query.get()
                    } else {
                        return snapshot
                    }
                } else {
                    return await query.get()
                }
            })()
            const originNotes = snapshot.docs.map((snapshot) => Note.new({ uid, snapshot }))
            const sortedNotes = sortBy(originNotes, (note) => [note.createTime, note.id]).reverse()
            setNotes(sortedNotes)

            return { fromCache: snapshot.metadata.fromCache }
        },
        [setNotes],
    )
    const fetchNotes = useCallback(
        async function fetchNotes(uid: string) {
            const { fromCache } = await fetchNotesFromServerOrCache(uid)
            if (fromCache) {
                void fetchNotesFromServerOrCache(uid)
            }
        },
        [fetchNotesFromServerOrCache],
    )
    return fetchNotes
}

function useSetNoteContent(noteKey: NoteKey, setNotes: SetNotes) {
    return useCallback(
        async function setNoteContent(content: string) {
            let noteRef: Note | null = null
            setNotes((notes) => {
                let noteRefIndex = -1
                const newNotes = produce(notes, (draft: Draft<Notes>) => {
                    if (noteKey) {
                        const index = draft.findIndex((note) => note.key === noteKey)
                        if (index >= 0) {
                            const note = draft[index]
                            if (!note.deleting) {
                                noteRefIndex = index
                                draft[index] = note.setContent(content)
                            }
                        }
                    }
                })
                noteRef = newNotes[noteRefIndex]
                return newNotes
            })
            if (noteRef) {
                await noteRef.upload()
            }
        },
        [noteKey, setNotes],
    )
}

function useRemoveAllNotes(setNotes: SetNotes, setNoteKey: SetNoteKey) {
    return useCallback(
        async function removeAllNotes(uid?: string) {
            setNotes([])
            setNoteKey(null)
            if (uid) {
                const query = await notesCollection.where("uid", "==", uid).get()
                query.forEach((doc) => {
                    void doc.ref.delete()
                })
            }
        },
        [setNotes, setNoteKey],
    )
}

function useDeleteNote(setNoteKey: SetNoteKey, notes: Notes, setNotes: SetNotes) {
    return useCallback(
        async function deleteNote(noteKey: NoteKey) {
            if (!noteKey) return
            const index = notes.findIndex((n) => n.key === noteKey)
            if (index < 0) return
            const note = notes[index]

            // Delete note from react store
            setNoteKey(null)

            // Delete note from database
            if (!note.deleted) {
                // Delete note logical
                const newNote = await note.delete({ type: "soft" })
                setNotes(
                    produce((notes: Draft<Notes>) => {
                        notes[index] = newNote
                    }),
                )
            } else {
                // Delete note physical
                setNotes(
                    produce((notes: Draft<Notes>) => {
                        notes.splice(index, 1)
                    }),
                )
                await note.delete({ type: "hard" })
            }
        },
        [notes, setNoteKey, setNotes],
    )
}

function usePremadeNotes() {
    return useMemo((): Notes => {
        return docs.map((content) => Note.new({ type: NoteType.Local, content }))
    }, [])
}

function useResetNotes(setNotes: SetNotes, premadeNotes: Notes) {
    return useCallback(
        /**
         * Reset `notes` to premade notes.
         *
         * You can also pass a note list as the premade note. Useful when testing.
         */
        function resetNote(notes?: Note[]) {
            setNotes(notes || premadeNotes)
        },
        [premadeNotes, setNotes],
    )
}

function useCreateServerNote(setNotes: SetNotes, setNoteKey: SetNoteKey) {
    return useCallback(
        function createServerNote(uid: string) {
            const note = Note.new({ uid, type: NoteType.Server })
            setNotes(
                produce((notes: Draft<Notes>) => {
                    notes.unshift(note)
                }),
            )
            setNoteKey(note.key)
        },
        [setNoteKey, setNotes],
    )
}

function useCreateLocalNote(setNotes: SetNotes, setNoteKey: SetNoteKey) {
    return useCallback(
        function createLocalNote() {
            const note = Note.new({ type: NoteType.Local })
            setNotes(
                produce((notes: Draft<Notes>) => {
                    notes.unshift(note)
                }),
            )
            setNoteKey(note.key)
        },
        [setNoteKey, setNotes],
    )
}

export function useNote() {
    const [notes, setNotes] = useNotes()
    const [noteKey, setNoteKey] = useNoteKey()

    const premadeNotes = usePremadeNotes()
    const setNoteContent = useSetNoteContent(noteKey, setNotes)
    const removeAllNotes = useRemoveAllNotes(setNotes, setNoteKey)
    const fetchNotes = useFetchNotes(setNotes)
    const deleteNote = useDeleteNote(setNoteKey, notes, setNotes)
    const resetNotes = useResetNotes(setNotes, premadeNotes)
    const createServerNote = useCreateServerNote(setNotes, setNoteKey)
    const createLocalNote = useCreateLocalNote(setNotes, setNoteKey)

    return {
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
    }
}
