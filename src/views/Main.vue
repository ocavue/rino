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
import { createComponent, onMounted, onUnmounted, watch } from "@vue/composition-api"

import * as store from "@/store"
import Appbar from "@/components/Appbar.vue"
import Sidebar from "@/components/Sidebar"
import Editor from "@/components/Editor.vue"
import Welcome from "@/components/Welcome.vue"

const {
    auth: { user },
    edit: { note, notes, fetchNotes },
} = store

export default createComponent({
    name: "Main",
    components: { Appbar, Sidebar, Editor, Welcome },
    setup() {
        let stopWatching: () => void = () => {}
        onMounted(() => {
            stopWatching = watch(user, userValue => {
                if (userValue) fetchNotes(userValue.uid)
                else notes.value = null
            })
        })
        onUnmounted(() => stopWatching())
        return { note: note }
    },
})
</script>

<style lang="scss" scoped></style>
