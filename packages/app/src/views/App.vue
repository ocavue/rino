<template>
    <v-app>
        <Sidebar
            :notes="notes"
            :current-note="note"
            :loading="loading"
            :email="email"
            :open-drawer="openDrawer"
            @create-note="createNote"
            @switch-note="switchNote"
        >
        </Sidebar>
        <v-content>
            <Appbar
                :note="note"
                :email="email"
                @delete-note="deleteNote"
                @sign-out="signOut"
                @toggle-drawer="toggleDrawer"
            ></Appbar>
            <v-layout class="main" align-center justify-start column>
                <Editor v-if="note" :key="note.id" :note="note"></Editor>
                <Welcome v-else />
            </v-layout>
        </v-content>
    </v-app>
</template>

<script lang="ts">
import Vue from "vue"

import { sortBy } from "lodash"

import { firebase, Note } from "../controller"
import Appbar from "../components/Appbar.vue"
import Sidebar from "../components/Sidebar.vue"
import Editor from "../components/Editor.vue"
import Welcome from "../components/Welcome.vue"

export default Vue.extend({
    name: "App",
    components: { Appbar, Sidebar, Editor, Welcome },
    data: (): {
        user?: firebase.User
        notes: Note[]
        note?: Note // Current note
        loading: boolean
        openDrawer: boolean
    } => ({
        user: undefined,
        notes: [],
        note: undefined,
        loading: true,
        openDrawer: true,
    }),
    computed: {
        email: function() {
            return this.user ? this.user.email : null
        },
    },
    mounted: function() {
        this.initAuth()
    },
    methods: {
        initAuth: function() {
            // Watch sign in and sign out
            firebase.auth().onAuthStateChanged(async user => {
                if (user) {
                    // User is signed in.
                    this.user = user
                    console.log("user.isAnonymous:", user.isAnonymous)
                    console.log("user.uid:", user.uid)
                    console.log("user.email:", user.email)
                    await this.fetchNotes()
                } else {
                    // User is signed out.
                    this.user = undefined
                    this.notes = []
                    this.note = undefined
                }
                this.loading = false
            })
        },
        fetchNotes: async function() {
            if (!this.user) throw new Error("Not login")
            const notes = await Note.list(this.user.uid)
            this.notes = sortBy(notes, note => [note.createTime, note.id])
        },
        createNote: function() {
            if (!this.user) throw new Error("Not login")
            const note = new Note(this.user.uid)
            this.notes.push(note)
            this.note = note
        },
        switchNote: function(note: Note) {
            this.note = note
        },
        deleteNote: function(note: Note) {
            note.remove()
            if (this.note === note) this.note = undefined
            const index = this.notes.indexOf(note)
            if (index > -1) this.notes.splice(index, 1)
        },
        signOut: function() {
            firebase
                .auth()
                .signOut()
                .then(() => {})
                .catch(error => console.error(error))
        },
        toggleDrawer: function() {
            this.openDrawer = !this.openDrawer
        },
    },
})
</script>

<style lang="scss" scoped>
.main {
    padding-top: 80px;
}
</style>
