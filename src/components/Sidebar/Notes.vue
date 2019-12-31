<template>
    <div data-testid="sidebar-notes" class="sidebar-notes">
        <SidebarColumnHeader>
            <v-spacer />
            <SidebarButton
                :data-testid="'sidebar-notes-btn-search' + (loading ? '-disabled' : '')"
                :disabled="loading"
                :icon="icons.mdiMagnify"
                :tbd="true"
            />
            <SidebarButton
                :data-testid="'sidebar-notes-btn-create-note' + (loading ? '-disabled' : '')"
                :disabled="loading"
                :icon="icons.mdiPlus"
                @click="createNote"
            />
        </SidebarColumnHeader>
        <v-divider></v-divider>

        <SidebarColumnBody class="sidebar-notes-list">
            <v-list-item v-if="signedIn === false" class="mt-4">
                <v-list-item-content>
                    <v-btn
                        :min-width="64"
                        data-testid="login-cancel-btn"
                        color="primary"
                        rounded
                        large
                        outlined
                        @click="signIn"
                    >
                        Sign in / Sign up
                    </v-btn>
                </v-list-item-content>
            </v-list-item>

            <v-list-item v-else-if="loading" class="mt-8">
                <v-list-item-content>
                    <v-progress-circular
                        color="#757575"
                        :indeterminate="true"
                        width="2"
                    ></v-progress-circular>
                </v-list-item-content>
            </v-list-item>

            <template v-for="note in notes">
                <v-list-item
                    :key="`item${note.key}`"
                    :ripple="false"
                    :input-value="currentNote === note"
                    color="primary"
                    data-testid="sidebar-notes-list-item"
                    @click="() => switchNote(note)"
                >
                    <v-list-item-content class="sidebar-notes-list__thumbnail">{{
                        note.thumbnail
                    }}</v-list-item-content>
                </v-list-item>
                <v-divider :key="`divider${note.key}`"></v-divider>
            </template>
        </SidebarColumnBody>
    </div>
</template>

<script lang="ts">
import { createComponent, computed, Ref, ref } from "@vue/composition-api"

import { mdiPlus, mdiMagnify } from "@mdi/js"
import { Note, getCurrentUser } from "@/controller"
import SidebarColumnHeader from "./SidebarColumnHeader.vue"
import SidebarColumnBody from "./SidebarColumnBody.vue"
import SidebarButton from "./SidebarButton.vue"
import * as store from "@/store"
import router from "@/router"

const {
    edit: { notes, note, isNotesFetched },
    auth: { user, email },
    state: { isSidebarActive },
} = store

export default createComponent({
    components: { SidebarColumnHeader, SidebarColumnBody, SidebarButton },
    props: {
        isMobile: { type: Boolean, required: true },
    },
    setup(props) {
        const icons = { mdiPlus, mdiMagnify }
        const loading = computed(() => !isNotesFetched(notes))
        const signedIn: Ref<boolean | null> = ref(null)

        const signIn = () => router.push({ name: "login" })
        function closeSidebarIfMobile() {
            if (props.isMobile) {
                isSidebarActive.value = false
            }
        }
        function createNote() {
            if (!user.value) throw new Error("Not login")
            if (isNotesFetched(notes)) {
                const noteObj = new Note(user.value.uid)
                notes.value.unshift(noteObj)
                note.value = noteObj
                closeSidebarIfMobile()
            }
        }
        function switchNote(noteObj: Note) {
            note.value = noteObj
            closeSidebarIfMobile()
        }
        setTimeout(() => {
            if (!getCurrentUser()) signedIn.value = true
            else signedIn.value = false
        }, 2000)

        return {
            icons,
            loading,
            signedIn,
            signIn,
            email,
            notes,
            currentNote: note,
            createNote,
            switchNote,
        }
    },
})
</script>

<style lang="scss" scoped>
.sidebar-notes {
    flex: 3;
}
.sidebar-notes-list {
    &__thumbnail {
        white-space: pre-line; // Line break with `\n`
        height: 72px;
        overflow: hidden;
        padding: 0;
        margin-top: 12px;
        margin-bottom: 12px;

        display: inline-flex;
        align-items: flex-start;
    }
}
</style>
