<template>
    <div class="message" data-testid="finish-sign-up">{{ message }}</div>
</template>

<script lang="ts">
import Vue from "vue"
import { firebase } from "@/controller"

export default Vue.extend({
    name: "FinishSignUp",
    data: () => ({ message: "Loading..." }),
    mounted: function() {
        // Confirm the link is a sign-in with email link.
        if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
            // Additional state parameters can also be passed via URL.
            // This can be used to continue the user's intended action before triggering
            // the sign-in operation.
            // Get the email if available. This should be available if the user completes
            // the flow on the same device where they started it.
            let email = window.localStorage.getItem("emailForSignIn")
            if (!email) {
                // User opened the link on a different device. To prevent session fixation
                // attacks, ask the user to provide the associated email again. For example:
                email = window.prompt("Please provide your email for confirmation") || ""
            }
            // The client SDK will parse the code from the link for you.
            firebase
                .auth()
                .signInWithEmailLink(email, window.location.href)
                .then(result => {
                    // Clear email from storage.
                    window.localStorage.removeItem("emailForSignIn")
                    // You can access the new user via result.user
                    // Additional user info profile not available via:
                    // result.additionalUserInfo.profile == null
                    // You can check if the user is new or existing:
                    // result.additionalUserInfo.isNewUser
                    this.$router.push({ path: "/" })
                })
                .catch(error => {
                    // Some error occurred, you can inspect the code: error.code
                    // Common errors could be invalid email and invalid or expired OTPs.
                    console.error("Failed to sign in:", error)
                    this.message = "Failed to sign in."
                })
        } else {
            this.message = "Failed to login"
        }
    },
})
</script>

<style lang="scss" scoped>
.message {
    padding: 16px;
}
</style>
