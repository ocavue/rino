<template>
    <div>{{ message }}</div>
</template>

<script lang="ts">
import { createComponent, ref, onMounted } from "@vue/composition-api"
import router from "@/router"
import { signOut } from "@/controller"

export default createComponent({
    setup(props, ctx) {
        const message = ref("")
        onMounted(async () => {
            message.value = "signing out"
            await signOut()
            router.push("/")
        })
        return { message }
    },
})
</script>
