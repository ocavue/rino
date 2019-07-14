<template>
    <div id="app">
        <Sidebar></Sidebar>
        <router-view id="main"></router-view>
    </div>
</template>

<script lang="ts">
import Vue from "vue"

import { firebase } from "./controller"

import Sidebar from "./components/Sidebar.vue"

export default Vue.extend({
    components: { Sidebar },
    data(): {
        user?: firebase.User
    } {
        return {
            user: undefined,
        }
    },
    mounted: function() {
        this.initAuth()
        this.signIn()
    },
    methods: {
        initAuth: function() {
            // Watch sign in and sign out
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    // User is signed in.
                    this.user = user
                    console.log("user.isAnonymous:", user.isAnonymous)
                    console.log("user.uid:", user.uid)
                } else {
                    // User is signed out.
                    this.user = undefined
                }
            })
        },
        signIn: function() {
            firebase
                .auth()
                .signInAnonymously()
                .catch(error => console.error(`Failed to sign in: ${error}`))
        },
    },
})
</script>

<style lang="scss">
body {
    font-family: "Fira Mono", "DejaVu Sans Mono", "Menlo", "Consolas", "Liberation Mono", "Monaco",
        "Lucida Console", monospace;
    padding: 0;
    margin: 0;
}

#app {
    display: flex;
    min-height: 100vh;
}

#main {
    flex: 1;
}
</style>
