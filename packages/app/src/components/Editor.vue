<template>
    <div ref="editor" class="markdown-body" @keydown="handleKeydown"></div>
</template>

<script lang="ts">
import Vue from "vue"
import { BaseView, ProseMirrorView, MarkdownView } from "../../../markdown/src/views"

export default Vue.extend({
    props: {
        content: {
            type: String,
            required: true,
        },
    },
    data(): {
        view?: BaseView
        sourceCodeMode: boolean
    } {
        return {
            view: undefined,
            sourceCodeMode: false,
        }
    },
    mounted: function() {
        if (this.view) this.view.destroy()
        let place = this.$refs.editor as HTMLElement
        this.view = new ProseMirrorView(place, this.content)
    },
    beforeDestroy: function() {
        if (this.view) this.view.destroy()
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
            }
        },
        getContent: function(): string {
            // This method will be called by parent component.
            return this.view ? this.view.content : ""
        },
    },
})
</script>

<style lang="sass" scoped>
@import url("../../../../node_modules/github-markdown-css/github-markdown.css")
@import url("../../style/editor.sass")
</style>
