<template>
    <div>
        <input class="editor-save-button" type="button" value="Save" @click="() => save(id)" />
        <center v-if="loading">Loading Editor...</center>
        <Editor v-if="!loading" ref="editor-component" :content="content"></Editor>
    </div>
</template>

<script lang="ts">
import Vue from "vue"
import { Note } from "../controller"
import Editor from "./Editor.vue"

export default Vue.extend({
    components: { Editor },
    data: (): {
        loading: boolean
        content: string
        unsubscribe: () => void
    } => ({
        loading: true,
        content: "",
        unsubscribe: () => {},
    }),
    computed: {
        id: function() {
            return this.$route.params.id
        },
    },
    watch: {
        id: async function(newId, oldId) {
            await this.save(oldId)
            await this.destroyEditor()
            await this.mountEditor(newId)
        },
    },
    mounted: async function() {
        await this.mountEditor(this.id)
    },
    beforeDestroy: function() {
        this.save(this.id)
    },
    methods: {
        save: async function(id: string) {
            if (this.loading) return
            let editor = this.$refs["editor-component"] as any
            let content = editor.getContent()
            await Note.update(id, content)
        },
        destroyEditor: async function() {
            this.content = ""
            this.loading = true
            this.unsubscribe()
            await this.$nextTick()
        },
        mountEditor: async function(id: string) {
            let note = await Note.get(id)
            this.content = note.content
            this.loading = false
            this.subscribeRemoveEvent(id)
            await this.$nextTick()
        },
        subscribeRemoveEvent: function(id: string) {
            // If current note is been deleted, then destroy the editor and go to homepage
            this.unsubscribe = Note.listen(async notes => {
                if (notes.filter(note => note.id === id).length >= 1) {
                    await this.destroyEditor()
                    this.$router.push("/")
                }
            }, "removed")
        },
    },
})
</script>

<style lang="sass" scoped>
.editor-save-button
    position: fixed
    top: 16px
    right: 16px
</style>
