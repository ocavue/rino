<template>
    <div class="sidebar">
        <div v-if="loading">Loading...</div>
        <div v-for="note in notes" :key="note.id">
            <router-link :to="`/e/${note.id}`">
                {{ note.id }}
            </router-link>
            <input type="button" value="delete" @click="remove(note.id)" />
            <br />
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
    },
})
</script>

<style lang="css">
.sidebar {
    position: absolute;
    top: 56px;
    right: 0;
    background-color: rgba(255, 255, 255, 0.5);
}
</style>
