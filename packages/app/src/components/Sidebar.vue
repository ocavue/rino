<template>
    <div class="sidebar">
        <button class="sidebar__create-button" @click="createNote">Create note</button>
        <div v-if="loading" class="sidebar__loading">Loading...</div>
        <div
            v-for="note in notes"
            :key="note.id"
            :class="{
                'sidebar-item': true,
                'sidebar-item--active': currentNoteId === note.id,
            }"
        >
            <router-link :to="`/e/${note.id}`" class="sidebar-item__link">
                {{ note.id }}
            </router-link>
            <button @click="remove(note.id)">Delete</button>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue"
import { Note } from "../controller"

export default Vue.extend({
    data: (): {
        notes: { id: string }[]
        loading: boolean
        unsubscribe: () => void
    } => ({
        notes: [],
        loading: true,
        unsubscribe: () => {},
    }),
    computed: {
        currentNoteId: function(): string {
            return this.$route.name === "edit" ? this.$route.params.id : ""
        },
    },
    created: async function() {
        this.notes = await Note.list()
        this.loading = false
        this.unsubscribe = Note.listen(notes => (this.notes = notes))
    },
    beforeDestroy: function() {
        this.unsubscribe()
    },
    methods: {
        remove: async function(id: string) {
            await Note.remove(id)
        },
        createNote: async function() {
            let doc = await Note.create()
            await Note.update(doc.id, "# default content")
            this.$router.push({ path: `/e/${doc.id}` })
        },
    },
})
</script>

<style lang="scss">
.sidebar {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;

    background-color: #e2e2e2;
    overflow-y: scroll;
    height: 100vh;
    width: 320px;

    &__create-button {
        min-height: 48px; // TODO: not working when window is too short
        height: 48px;
        margin: 16px;
    }

    &__loading {
        padding-top: 48px;
        align-self: center;
    }
}
.sidebar-item {
    min-height: 48px;
    border-bottom: 1px solid #b3b3b3;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 8px;
    padding-right: 8px;

    &__link {
        height: 100%;
        flex: 1;
        text-decoration: none;

        display: flex;
        align-items: center;
        color: inherit;
    }

    &--active {
        background: #d31473;
        color: white;
    }
}
</style>
