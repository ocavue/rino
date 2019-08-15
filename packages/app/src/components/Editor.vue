<template>
    <v-flex ref="editor" class="markdown-body" @keydown="handleKeydown"></v-flex>
</template>

<script lang="ts">
import Vue from "vue"
import { BaseView, ProseMirrorView, MarkdownView } from "../../../markdown/src/views"
import { Note } from "../controller"
import { debounce } from "lodash"

export default Vue.extend({
    props: {
        note: {
            type: Note,
            required: true,
        },
    },
    data(): {
        view?: BaseView
        sourceCodeMode: boolean
        update: () => void
    } {
        return {
            view: undefined,
            sourceCodeMode: false,
            update: () => {},
        }
    },
    mounted: function() {
        if (this.view) this.view.destroy()
        let place = this.$refs.editor as HTMLElement
        this.view = new ProseMirrorView(place, this.note.content)
        this.update = debounce(() => {
            console.log("Updating")
            if (this.view) {
                this.note.updateContent(this.view.content)
            }
        }, 1000)
    },
    beforeDestroy: function() {
        if (this.view) {
            this.note.updateContent(this.view.content)
            this.view.destroy()
        }
    },
    methods: {
        switchEditor: function() {
            if (!this.view) return
            this.sourceCodeMode = !this.sourceCodeMode
            let View = this.sourceCodeMode ? MarkdownView : ProseMirrorView
            let content = this.view.content
            this.view.destroy()
            this.view = new View(this.$refs.editor as HTMLElement, content)
            this.view.focus()
        },
        handleKeydown: function(event: KeyboardEvent) {
            if (event.metaKey && event.code === "Slash") {
                console.debug("meta + / has been pressed")
                this.switchEditor()
            } else {
                this.update()
            }
        },
    },
})
</script>

<style lang="scss" scoped>
@import url("../../../../node_modules/github-markdown-css/github-markdown.css");
@import url("../../style/editor.sass");

.markdown-body {
    height: 100vh;

    margin: 16px;
    width: 1000px;
    max-width: 100%;
}
</style>
