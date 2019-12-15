import { ref, Ref, computed, watch } from "@vue/composition-api"
import { User } from "@/controller"

const user: Ref<User | null> = ref(null)
const email = computed(() => (user.value ? user.value.email : null))

if (process.env.NODE_ENV !== "production") {
    watch(() => {
        if (user.value) {
            window.localStorage.setItem("__rino_dev_auth_state", "yes")
        } else {
            window.localStorage.setItem("__rino_dev_auth_state", "no")
        }
    })
}

export { user, email }
