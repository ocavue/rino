import { ref, Ref } from "@vue/composition-api"
import { Note } from "@/controller"

const note: Ref<Note | null> = ref(null)

/**
 * All notes that the signed in user has. `notes` is `null` if not user is
 * signed in or is fetching notes.
 */
const notes: Ref<Note[] | null> = ref(null)

async function fetchNotes(uid: string) {
    notes.value = await Note.list(uid)
}

async function cleanNotes(uid: string) {
    await fetchNotes(uid)
    for (const note of notes.value || []) await note.remove()
    notes.value = []
}

function isNotesFetched(notes: Ref<Note[] | null>): notes is Ref<Note[]> {
    return notes.value !== null
}

export { note, notes, isNotesFetched, fetchNotes, cleanNotes }
