import { ref, Ref, computed } from "@vue/composition-api"
import { User } from "@/controller"

const user: Ref<User | null> = ref(null)
const email = computed(() => (user.value ? user.value.email : null))

export { user, email }
