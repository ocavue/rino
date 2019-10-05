<template>
    <div>...</div>
</template>

<script lang="ts">
import Vue from "vue"
import { signInWithEmailAndPassword } from "@/controller"
import { testUser } from "@/controller/config"

export default Vue.extend({
    name: "AutoLogin",
    mounted: function() {
        console.log(`Sign in with ${testUser.username} ${testUser.password}`)
        signInWithEmailAndPassword(testUser.username, testUser.password)
            .then(() => this.$router.push("/"))
            .catch(error => console.error(error))
    },
})
</script>
