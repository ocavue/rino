<template>
    <div>
        <input type="button" value="Create note" @click="createNote" />
        <Sidebar></Sidebar>
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import Vue from "vue"

import { Note, firebase } from "./controller"

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
        createNote: async function() {
            let doc = await Note.create()
            await Note.update(doc.id, "# default content")
            this.$router.push({ path: `/e/${doc.id}` })
        },
    },
})
</script>

<style lang="sass">
body
    font-family: "Fira Mono", "DejaVu Sans Mono", "Menlo", "Consolas", "Liberation Mono", "Monaco", "Lucida Console", monospace
    padding: 0
    margin: 0

header
    display: flex
    flex-flow: wrap
    justify-content: space-between
    align-items: center
    height: 3em
    line-height: 1em
    padding-left: 16px
    padding-right: 16px
    background-color: darkmagenta
    color: rgba(255, 255, 255, 0.8)
</style>
