<template>
    <div></div>
</template>

<script lang="ts">
import { createComponent, onMounted } from "@vue/composition-api"
import router from "@/router"
import { signInWithEmailAndPassword, getCurrentUser } from "@/controller"
import { testUser } from "@/controller/config"
import { cleanNotes } from "@/store/edit"

export default createComponent({
    setup() {
        onMounted(() => {
            setTimeout(async () => {
                let user = getCurrentUser()
                if (user) {
                    console.log("Found current user")
                    await cleanNotes(user.uid)
                } else {
                    console.log("Signing in")
                    const cred = await signInWithEmailAndPassword(
                        testUser.username,
                        testUser.password,
                    )
                    user = cred.user
                    if (user) await cleanNotes(user.uid)
                }
                router.push("/")
            }, 2000)
        })
    },
})
</script>
