<template>
    <router-view></router-view>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
    name: "App",
})
</script>

<style lang="scss">
@import "~vuetify/src/styles/styles.sass";

body {
    background-color: map-get($material-light, "background");
}
</style>
