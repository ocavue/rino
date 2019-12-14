import { ref } from "@vue/composition-api"
import { firebase } from "@/controller"

function useConnected() {
    const connected = ref(true)
    firebase
        .database()
        .ref(".info/connected")
        .on("value", function(snap) {
            connected.value = snap.val() === true
            console.log(`Firebase is ${connected.value ? "online" : "offline"}`)
        })
    return connected
}

const connected = useConnected()

const isSidebarActive = ref(true)

export { connected, isSidebarActive }
