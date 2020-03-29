import { Draft, produce } from "immer"
import { Note, NoteType } from "./note"
import { docs } from "../docs"
import { notesCollection } from "../firebase"
import { sortBy } from "lodash"
import { useCallback, useMemo, useState } from "react"

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
    return useCallback(
        async function fetchNotes(uid: string) {
            const query = await notesCollection.where("uid", "==", uid).get()
            const originNotes = query.docs.map((snapshot) => Note.new({ uid, snapshot }))
            const sortedNotes = sortBy(originNotes, (note) => [note.createTime, note.id]).reverse()
            setNotes(sortedNotes)
        },
        [setNotes],
    )
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
                await (noteRef as Note).upload()
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
                    doc.ref.delete()
                })
            }
        },
        [setNotes, setNoteKey],
    )
}

function useDeleteNote(noteKey: NoteKey, setNoteKey: SetNoteKey, notes: Notes, setNotes: SetNotes) {
    return useCallback(
        async function deleteNote() {
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
        [noteKey, notes, setNoteKey, setNotes],
    )
}

function usePremadeNotes() {
    return useMemo((): Notes => {
        return docs.map((content) => Note.new({ type: NoteType.Local, content }))
    }, [])
}

function useResetNotes(setNotes: SetNotes, premadeNotes: Notes) {
    return useCallback(
        function resetNote() {
            setNotes(premadeNotes)
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
    const note = useMemo(() => notes.find((n) => n.key === noteKey), [noteKey, notes])

    const premadeNotes = usePremadeNotes()
    const setNoteContent = useSetNoteContent(noteKey, setNotes)
    const removeAllNotes = useRemoveAllNotes(setNotes, setNoteKey)
    const fetchNotes = useFetchNotes(setNotes)
    const deleteNote = useDeleteNote(noteKey, setNoteKey, notes, setNotes)
    const resetNotes = useResetNotes(setNotes, premadeNotes)
    const createServerNote = useCreateServerNote(setNotes, setNoteKey)
    const createLocalNote = useCreateLocalNote(setNotes, setNoteKey)

    return {
        note,
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
