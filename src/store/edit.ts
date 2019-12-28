import { ref, Ref } from "@vue/composition-api"
import { Note } from "@/controller"
import { user } from "./auth"

const note: Ref<Note | null> = ref(null)
const notes: Ref<Note[]> = ref([])
const fetchingNotes = ref(false)

async function fetchNotes(uid: string) {
    fetchingNotes.value = true
    if (!user.value) throw new Error("Not login")
    notes.value = await Note.list(uid)
    fetchingNotes.value = false
}

export { note, notes, fetchingNotes, fetchNotes }
