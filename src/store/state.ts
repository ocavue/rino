import { ref, Ref, watch } from "@vue/composition-api"
import { registerConnectionEvent } from "@/controller"

function useConnected() {
    const connected = ref(true)
    registerConnectionEvent(value => (connected.value = value))
    return connected
}

const connected = useConnected()

const isSidebarActive = ref(true)

const isAboutDialogActive = ref(false)

function useDark() {
    const defaultValue = false
    const dark: Ref<boolean> = ref(defaultValue)
    const key = "rino_dark"
    switch (window.localStorage.getItem(key)) {
        case "yes":
            dark.value = true
            break
        case "no":
            dark.value = false
            break
    }
    watch(dark, value => window.localStorage.setItem(key, value ? "yes" : "no"))
    return dark
}
const dark = useDark()

export { connected, isSidebarActive, isAboutDialogActive, dark }
