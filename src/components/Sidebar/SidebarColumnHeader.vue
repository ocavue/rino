<template>
    <div class="sidebar-column-header">
        <slot />
    </div>
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({})
</script>

<style lang="scss" scoped>
@import "@/style/constants.sass";

.sidebar-column-header {
    padding: $app-bar-padding;

    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
}
</style>
