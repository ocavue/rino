import { ref, Ref } from "@vue/composition-api"
import { Note } from "@/controller"

const note: Ref<Note | null> = ref(null)
const notes: Ref<Note[]> = ref([])
const fetchingNotes = ref(false)

export { note, notes, fetchingNotes }
