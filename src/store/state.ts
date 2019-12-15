import { ref } from "@vue/composition-api"
import { registerConnectionEvent } from "@/controller"

function useConnected() {
    const connected = ref(true)
    registerConnectionEvent(value => (connected.value = value))
    return connected
}

const connected = useConnected()

const isSidebarActive = ref(true)

const isAboutDialogActive = ref(false)

export { connected, isSidebarActive, isAboutDialogActive }
