<template>
    <v-app>
        <v-content id="login">
            <v-container fluid>
                <v-card v-if="!sented">
                    <v-card-title>Sign in with email</v-card-title>
                    <v-card-text>
                        <v-text-field v-model="email" label="Email"></v-text-field>
                        <p v-if="error" class="login__error">{{ error }}</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn :loading="senting" color="primary" @click="login">Next</v-btn>
                    </v-card-actions>
                </v-card>
                <v-card v-else>
                    <v-card-text class="login__message" data-testid="login-message">
                        A sign-in email with additional instructions was sent to
                        <strong>{{ email }}</strong
                        >. Check your email to complete sign-in.
                    </v-card-text>
                </v-card>
            </v-container>
        </v-content>
    </v-app>
</template>

<script lang="ts">
import Vue from "vue"
import { sendSignInLink, signInWithEmailAndPassword } from "@/controller"
import { testUser } from "@/controller/config"

export default Vue.extend({
    name: "Login",
    data: () => ({
        email: "",
        error: "",
        senting: false,
        sented: false,
    }),
    mounted: function() {
        if (process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development") {
            console.log(`Sign in with ${testUser.username} ${testUser.password}`)
            signInWithEmailAndPassword(testUser.username, testUser.password)
                .then(() => {
                    this.sented = true
                    this.$router.push("/")
                })
                .catch(error => console.error(error))
        }
    },
    methods: {
        login: function() {
            this.error = ""
            this.senting = true
            sendSignInLink(this.email)
                .then(() => {
                    this.sented = true
                    // The link was successfully sent. Inform the user.
                    // Save the email locally so you don't need to ask the user for it again
                    // if they open the link on the same device.
                    window.localStorage.setItem("emailForSignIn", this.email)
                })
                .catch(error => {
                    this.error = error
                    console.error(error)
                })
                .finally(() => {
                    this.senting = false
                })
        },
    },
})
</script>

<style lang="scss" scoped>
.login__error {
    color: red;
}
</style>
