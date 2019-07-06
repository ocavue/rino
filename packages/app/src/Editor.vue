<template>
    <div ref="container" class="editor-container markdown-body" @keydown="handleKeydown"></div>
</template>

<script lang="ts">
import Vue from "vue"
import { BaseView, ProseMirrorView, MarkdownView } from "../../markdown/src/views"
import { defaultContent } from "./welcome"

export default Vue.extend({
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
        let place = this.$refs.container as HTMLElement
        this.view = new ProseMirrorView(place, defaultContent)
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
            this.view = new View(this.$refs.container as HTMLElement, content)
            this.view.focus()
        },
        handleKeydown: function(event: KeyboardEvent) {
            if (event.metaKey && event.code === "Slash") {
                console.debug("meta + / has been pressed")
                this.switchEditor()
            }
        },
    },
})
</script>

<style lang="sass" scoped>
@import url("../../../node_modules/github-markdown-css/github-markdown.css")
@import url("../style/editor.sass")
</style>
