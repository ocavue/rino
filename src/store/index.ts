import { ref, Ref, computed } from "@vue/composition-api"
import { firebase, User, Note } from "@/controller"

const user: Ref<User | null> = ref(null)
const email = computed(() => (user.value ? user.value.email : null))

const notes: Ref<Note[]> = ref([])
const note: Ref<Note | null> = ref(null)

const isSidebarActive = ref(true)

const connected = ref(true)

function setup() {
    firebase
        .database()
        .ref(".info/connected")
        .on("value", function(snap) {
            connected.value = snap.val() === true
            console.log(`Firebase is ${connected.value ? "on" : "off"}line`)
        })
}

setup()

export { user, isSidebarActive, notes, note, email, connected }
