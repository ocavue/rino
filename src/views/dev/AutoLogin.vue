<template>
    <div>...</div>
</template>

<script lang="ts">
import { createComponent, onMounted } from "@vue/composition-api"
import router from "@/router"
import { signInWithEmailAndPassword } from "@/controller"
import { testUser } from "@/controller/config"

export default createComponent({
    setup() {
        onMounted(async () => {
            console.log(`Sign in with ${testUser.username} ${testUser.password}`)
            await signInWithEmailAndPassword(testUser.username, testUser.password)
            router.push("/")
        })
    },
})
</script>
