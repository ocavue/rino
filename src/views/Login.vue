<template>
    <v-app>
        <v-content>
            <v-container fluid class="login-container fill-height">
                <v-row align="center" justify="center">
                    <v-col>
                        <v-card
                            v-if="!sented"
                            class="login-card"
                            :loading="senting"
                            data-testid="login-form-card"
                        >
                            <v-card-title class="login-card__title">
                                Sign in with email
                            </v-card-title>
                            <v-card-text class="login-card__text">
                                <v-text-field
                                    v-model="email"
                                    label="Email"
                                    data-testid="login-text-field"
                                ></v-text-field>
                                <p v-if="error" class="red--text" data-testid="login-error">
                                    {{ error }}
                                </p>
                            </v-card-text>
                            <v-card-actions class="login-card__actions">
                                <v-spacer />
                                <v-btn
                                    :min-width="88"
                                    text
                                    data-testid="login-cancel-btn"
                                    @click="cancel"
                                >
                                    Cancel
                                </v-btn>
                                <v-btn
                                    :min-width="88"
                                    color="primary"
                                    data-testid="login-next-btn"
                                    @click="login"
                                >
                                    Next
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                        <v-card v-else class="login-card" data-testid="login-result-card">
                            <v-card-title class="login-card__title">
                                Sign-in email sent
                            </v-card-title>
                            <v-card-text class="login-card__text" data-testid="login-message">
                                A sign-in email with additional instructions was sent to
                                <strong>{{ email }}</strong
                                >. Check your email to complete sign-in.
                            </v-card-text>
                            <v-card-actions class="login-card__actions">
                                <v-spacer />
                                <v-btn
                                    :min-width="88"
                                    text
                                    data-testid="login-back-btn"
                                    @click="back"
                                >
                                    Back
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                        <!-- TODO: Privacy and Terms -->
                        <!-- <v-row class="login-footer">
                            <v-spacer />
                            <v-btn text small color="grey--lighten-1">Privacy</v-btn>
                            <v-btn text small color="grey--lighten-1">Terms</v-btn>
                        </v-row> -->
                    </v-col>
                </v-row>
            </v-container>
        </v-content>
    </v-app>
</template>

<script lang="ts">
import Vue from "vue"
import { sendSignInLink } from "@/controller"

export default Vue.extend({
    name: "Login",
    data: () => ({
        email: "",
        error: "",
        senting: false,
        sented: false,
    }),
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
        cancel: function() {
            this.$router.push({ path: "/" })
        },
        back: function() {
            this.error = ""
            this.senting = false
            this.sented = false
        },
    },
})
</script>

<style lang="scss" scoped>
.login-container {
    width: 512px;
}

.login-card {
    &__title,
    &__text,
    &__actions {
        padding-left: 32px;
        padding-right: 32px;
    }

    &__title {
        padding-top: 48px;
    }
    &__text {
        padding-top: 32px;
    }
    &__actions {
        padding-bottom: 40px;
    }
}

.login-footer {
    padding-top: 16px;
}
</style>
