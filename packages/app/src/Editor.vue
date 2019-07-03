<template>
    <div ref="container" class="editor-container markdown-body"></div>
</template>

<script lang="ts">
import Vue from "vue"
import { BaseView, ProseMirrorView, MarkdownView } from "../../markdown/src/views"
import { defaultContent } from "./welcome"

export default Vue.extend({
    props: {
        sourceCodeMode: Boolean,
    },
    data(): {
        view?: BaseView
    } {
        return {
            view: undefined,
        }
    },
    watch: {
        sourceCodeMode: function(newVal, oldVal) {
            console.log("sourceCodeMode:", this.sourceCodeMode)
            if (!this.view) return
            if (newVal === oldVal) return // TODO: necessary?
            let View = this.sourceCodeMode ? MarkdownView : ProseMirrorView
            let content = this.view.content
            this.view.destroy()
            this.view = new View(this.$refs.container as HTMLElement, content)
            this.view.focus()
        },
    },
    mounted: function() {
        let place = this.$refs.container as HTMLElement
        this.view = new ProseMirrorView(place, defaultContent)
    },
    beforeDestroy: function() {
        if (this.view) this.view.destroy()
    },
})
</script>

<style lang="sass" scoped>
@import url("../../../node_modules/github-markdown-css/github-markdown.css")
@import url("../style/editor.sass")
</style>
