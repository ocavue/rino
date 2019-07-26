<template>
    <router-view></router-view>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
    name: "Layout",
})
</script>

<style lang="scss">
body {
    font-family: "Fira Mono", "DejaVu Sans Mono", "Menlo", "Consolas", "Liberation Mono", "Monaco",
        "Lucida Console", monospace;
    padding: 0;
    margin: 0;
}
</style>
