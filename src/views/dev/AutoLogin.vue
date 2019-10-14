<template>
    <div>{{ msg }}</div>
</template>

<script lang="ts">
import Vue from "vue"
import { signInWithEmailAndPassword, getCurrentUserEmail } from "@/controller"
import { testUser } from "@/controller/config"

export default Vue.extend({
    name: "AutoLogin",
    data: () => ({ msg: "loading" }),
    mounted: function() {
        if (testUser.username !== getCurrentUserEmail()) {
            this.msg = "signing in"
            this.signIn()
        } else {
            this.msg = "signed in"
            this.$router.push("/")
        }
    },
    methods: {
        signIn: function() {
            console.log(`Sign in with ${testUser.username} ${testUser.password}`)
            signInWithEmailAndPassword(testUser.username, testUser.password)
                .then(() => this.$router.push("/"))
                .catch(error => console.error(error))
        },
    },
})
</script>
