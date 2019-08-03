<template>
    <div id="login">
        <p v-if="!sented">
            <label>
                Sign in with email:
                <input v-model="email" placeholder="Email" name="email" type="email" />
            </label>
            <button @click="login">Next</button>
        </p>
        <p v-else class="login__message">
            A sign-in email with additional instructions was sent to <strong>{{ email }}</strong
            >. Check your email to complete sign-in.
        </p>
    </div>
</template>

<script lang="ts">
import Vue from "vue"
import { sendSignInLink, signInWithEmailAndPassword } from "../controller"
import { env } from "../controller/config"

export default Vue.extend({
    name: "Login",
    data: () => ({
        email: "",
        sented: false,
    }),
    mounted: function() {
        if (env.TESTING) {
            signInWithEmailAndPassword(env.TEST_USERNAME, env.TEST_PASSWORD)
                .then(() => (this.sented = true))
                .catch(error => console.error(error))
        }
    },
    methods: {
        login: function() {
            sendSignInLink(this.email)
                .then(() => {
                    this.sented = true
                    // The link was successfully sent. Inform the user.
                    // Save the email locally so you don't need to ask the user for it again
                    // if they open the link on the same device.
                    window.localStorage.setItem("emailForSignIn", this.email)
                })
                .catch(error => console.error(error))
        },
    },
})
</script>

<style lang="scss" scoped></style>
