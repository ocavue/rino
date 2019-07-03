<template>
    <div>
        <header>
            Rino (Early Access Version)
            <span style="flex: 1;"></span>
            <input v-model="sourceCodeMode" type="checkbox" />
            Source Code Mode
        </header>
        <Editor :source-code-mode="sourceCodeMode" />
        <footer>vue footer</footer>
    </div>
</template>

<script lang="ts">
import Vue from "vue"
import Editor from "./Editor.vue"

export default Vue.extend({
    components: { Editor },
    data() {
        return {
            sourceCodeMode: false,
        }
    },
})
</script>

<style lang="sass">
body
    font-family: "Fira Mono", "DejaVu Sans Mono", "Menlo", "Consolas", "Liberation Mono", "Monaco", "Lucida Console", monospace
    padding: 0
    margin: 0

header
    display: flex
    flex-flow: wrap
    justify-content: space-between
    align-items: center
    height: 3em
    line-height: 1em
    padding-left: 16px
    padding-right: 16px
    background-color: darkmagenta
    color: rgba(255, 255, 255, 0.8)
</style>
