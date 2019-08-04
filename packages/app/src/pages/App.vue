<template>
    <div id="app">
        <Sidebar
            :notes="notes"
            :current-note="note"
            :loading="loadingNotes"
            :email="user ? user.email : null"
            @create-note="createNote"
            @switch-note="switchNote"
            @delete-note="deleteNote"
        >
        </Sidebar>
        <main id="main">
            <Editor v-if="note" :key="note.id" :note="note"></Editor>
            <Welcome v-else />
        </main>
    </div>
</template>

<script lang="ts">
import Vue from "vue"

import { sortBy } from "lodash"

import { firebase, Note } from "../controller"
import Sidebar from "../components/Sidebar.vue"
import Editor from "../components/Editor.vue"
import Welcome from "../components/Welcome.vue"

export default Vue.extend({
    components: { Sidebar, Editor, Welcome },
    data: (): {
        user?: firebase.User
        notes: Note[]
        note?: Note // Current note
        loadingNotes: boolean
    } => ({
        user: undefined,
        notes: [],
        note: undefined,
        loadingNotes: true,
    }),
    mounted: function() {
        this.initAuth()
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
                    console.log("user.email:", user.email)
                    this.fetchNotes()
                } else {
                    // User is signed out.
                    this.user = undefined
                    this.notes = []
                    this.note = undefined
                }
            })
        },
        fetchNotes: async function() {
            if (!this.user) throw new Error("Not login")
            const notes = await Note.list(this.user.uid)
            this.loadingNotes = false
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
    },
})
</script>

<style lang="scss" scoped>
#app {
    display: flex;
    min-height: 100vh;
}

#main {
    flex: 1;
}
</style>
