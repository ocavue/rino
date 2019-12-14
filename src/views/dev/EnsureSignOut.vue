<template>
    <div>{{ message }}</div>
</template>

<script lang="ts">
import { createComponent, ref, onMounted, watch } from "@vue/composition-api"
import router from "@/router"
import { signOut } from "@/controller"
import { auth } from "@/store"

export default createComponent({
    setup(props, ctx) {
        const message = ref("")
        const watchUser = watch(() => {
            if (auth.user.value === null) router.push("/")
        })
        onMounted(() => {
            message.value = "signing out"
            signOut().catch(error => {
                throw error
            })
        })
        return { message, watchUser }
    },
})
</script>
