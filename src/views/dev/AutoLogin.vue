<template>
    <div>...</div>
</template>

<script lang="ts">
import { createComponent, onMounted } from "@vue/composition-api"
import router from "@/router"
import { signInWithEmailAndPassword } from "@/controller"
import { testUser } from "@/controller/config"

export default createComponent({
    name: "AutoLogin",
    setup() {
        onMounted(() => {
            console.log(`Sign in with ${testUser.username} ${testUser.password}`)
            signInWithEmailAndPassword(testUser.username, testUser.password)
                .then(() => router.push("/"))
                .catch(error => {
                    throw error
                })
        })
    },
})
</script>
