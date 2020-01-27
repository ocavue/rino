import { Draft, produce } from "immer"
import { Note } from "./note"
import { createContainer } from "unstated-next"
import { notesCollection } from "./collection"
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
            const originNotes = query.docs.map(snapshot => Note.new(uid, snapshot))
            const sortedNotes = sortBy(originNotes, note => [note.createTime, note.id]).reverse()
            setNotes(sortedNotes)
        },
        [setNotes],
    )
}

function useSetNoteContent(note: Note | undefined, notes: Notes, setNotes: SetNotes) {
    return useCallback(
        async function setNoteContent(content: string) {
            if (!note) return
            const index = notes.findIndex(n => n.key === note.key)
            if (index < 0) return
            const newNotes = produce(notes, (notesDraft: Draft<Notes>) => {
                notesDraft[index] = note.setContent(content)
            })
            setNotes(newNotes)
            await newNotes[index].upload()
        },
        [note, notes, setNotes],
    )
}

function useRemoveAllNotes(setNotes: SetNotes) {
    return useCallback(
        async function removeAllNotes(uid: string) {
            setNotes([])
            const query = await notesCollection.where("uid", "==", uid).get()
            query.forEach(doc => {
                doc.ref.delete()
            })
        },
        [setNotes],
    )
}

function useRemoveNote(noteKey: NoteKey, setNoteKey: SetNoteKey, notes: Notes, setNotes: SetNotes) {
    return useCallback(
        async function removeNote() {
            if (!noteKey) return
            const index = notes.findIndex(n => n.key === noteKey)
            if (index < 0) return
            const note = notes[index]

            // Remove note from react store
            setNoteKey(null)
            setNotes(
                produce((notes: Draft<Notes>) => {
                    notes.splice(index, 1)
                }),
            )

            // Remove note from database
            await note.delete()
        },
        [noteKey, notes, setNoteKey, setNotes],
    )
}

function useResetNotes(setNotes: SetNotes) {
    return useCallback(
        function resetNote() {
            setNotes([])
        },
        [setNotes],
    )
}

function useCreateNote(setNotes: SetNotes, setNoteKey: SetNoteKey) {
    return useCallback(
        function createNote(uid: string) {
            const note = Note.new(uid)
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

function useEdit() {
    const [notes, setNotes] = useNotes()
    const [noteKey, setNoteKey] = useNoteKey()
    const note = useMemo(() => notes.find(n => n.key === noteKey), [noteKey, notes])

    const fetchNotes = useFetchNotes(setNotes)
    const setNoteContent = useSetNoteContent(note, notes, setNotes)
    const removeAllNotes = useRemoveAllNotes(setNotes)
    const removeNote = useRemoveNote(noteKey, setNoteKey, notes, setNotes)
    const resetNotes = useResetNotes(setNotes)
    const createNote = useCreateNote(setNotes, setNoteKey)

    return {
        note,
        notes,
        noteKey,
        setNoteKey,
        fetchNotes,
        setNoteContent,
        removeAllNotes,
        removeNote,
        resetNotes,
        createNote,
    }
}

export const EditContainer = createContainer(useEdit)
