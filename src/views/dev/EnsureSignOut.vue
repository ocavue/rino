<template>
    <div>...</div>
</template>

<script lang="ts">
import { createComponent, onMounted } from "@vue/composition-api"
import router from "@/router"
import { signOut } from "@/controller"
import { auth } from "@/store"

export default createComponent({
    name: "AutoLogin",
    setup() {
        onMounted(() => {
            if (!auth.user.value) return
            signOut()
                .then(() => router.push("/"))
                .catch(error => {
                    throw error
                })
        })
    },
})
</script>
