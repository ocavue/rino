<template>
    <v-app>
        <Sidebar />
        <v-content>
            <Appbar />
            <v-layout class="main" align-center justify-start column fill-height>
                <Editor v-if="note" :key="note.key" :note="note"></Editor>
                <Welcome v-else />
            </v-layout>
        </v-content>
    </v-app>
</template>

<script lang="ts">
import { createComponent, onMounted } from "@vue/composition-api"

import { firebase, Note } from "@/controller"
import * as store from "@/store"
import Appbar from "@/components/Appbar.vue"
import Sidebar from "@/components/Sidebar"
import Editor from "@/components/Editor.vue"
import Welcome from "@/components/Welcome.vue"

async function fetchNotes() {
    if (!store.auth.user.value) throw new Error("Not login")
    store.edit.notes.value = await Note.list(store.auth.user.value.uid)
}

function initAuth() {
    // Watch sign in and sign out
    firebase.auth().onAuthStateChanged(async u => {
        if (u) {
            // User is signed in.
            console.log("user.isAnonymous:", u.isAnonymous)
            console.log("user.uid:", u.uid)
            console.log("user.email:", u.email)
            store.auth.user.value = u
            await fetchNotes()
        } else {
            // User is signed out.
            store.auth.user.value = null
        }
    })
}

export default createComponent({
    name: "Main",
    components: { Appbar, Sidebar, Editor, Welcome },
    setup() {
        onMounted(initAuth)
        return { note: store.edit.note }
    },
})
</script>

<style lang="scss" scoped></style>
