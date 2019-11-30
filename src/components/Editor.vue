<template>
    <v-container fill-height justify-center fluid>
        <v-flex ref="editor" class="editor markdown-body" data-testid="editor"></v-flex>
    </v-container>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"

import { BaseView, ProseMirrorView, MarkdownView } from "@/editor"
import { Note } from "@/controller"
import { debounce } from "lodash"

export default Vue.extend({
    name: "Editor",
    props: {
        note: {
            type: Note as PropType<Note>,
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
        this.initEditor()
        this.update = debounce(() => {
            console.log("Updating")
            if (this.view) {
                this.note.updateContent(this.view.content)
            }
        }, 1000)
        window.addEventListener("keydown", this.handleKeydown)
    },
    beforeDestroy: function() {
        window.removeEventListener("keydown", this.handleKeydown)
        if (this.view) {
            this.note.updateContent(this.view.content)
            this.view.destroy()
        }
    },
    methods: {
        initEditor: function() {
            let View = this.sourceCodeMode ? MarkdownView : ProseMirrorView
            let content = this.view ? this.view.content : this.note.content
            if (this.view) this.view.destroy()
            try {
                this.view = new View(this.$refs.editor as HTMLElement, content)
            } catch (error) {
                setTimeout(() => alert(`Failed to load markown content:\n${error}`), 0)
            }
            if (this.view) this.view.focus()
        },
        switchEditor: function() {
            this.sourceCodeMode = !this.sourceCodeMode
            this.initEditor()
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
.editor {
    height: 100%;
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
}
</style>

<style lang="scss">
@import "../../node_modules/github-markdown-css/github-markdown.css";
@import "../style/editor.sass";

// For source code mode
.markdown-body > textarea {
    padding-top: 80px;
    height: 100%;
    overflow: visible;
    font-family: monospace; // Make tables align

    border: none;
    outline: none;
    box-shadow: none;
}

// For WYSIWYG mode
.markdown-body > .ProseMirror {
    padding-left: calc(50% - 512px);
    padding-right: calc(50% - 512px);

    padding-top: 80px;
    flex: 1;

    border: none;
    outline: none;
    box-shadow: none;
}

// Override vuetify's styles
.v-application {
    code {
        color: inherit;
        box-shadow: none;
    }
    code::before {
        content: "";
    }
    code::after {
        content: "";
    }
}
</style>
