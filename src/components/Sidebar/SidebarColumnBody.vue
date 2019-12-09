<template>
    <div class="sidebar-column-body">
        <slot />
    </div>
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({})
</script>

<style lang="scss" scoped>
.sidebar-column-body {
    flex: 1;
    padding-top: 0;
    padding-bottom: 0;
    overflow: scroll;
}
</style>
