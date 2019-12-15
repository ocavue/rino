<template>
    <v-navigation-drawer
        v-model="isSidebarActive"
        app
        left
        class="sidebar"
        data-testid="sidebar"
        :width="width"
        :mobile-break-point="mobileBreakPoint"
    >
        <div class="sidebar-row">
            <Activity class="sidebar-column" />
            <Notes :is-mobile="isMobile" class="sidebar-column" />
        </div>
    </v-navigation-drawer>
</template>

<script lang="ts">
import { createComponent, computed } from "@vue/composition-api"
import { state } from "@/store"
import { $vuetify } from "@/plugins/vuetify"

import Notes from "./Notes.vue"
import Activity from "./Activity.vue"

export default createComponent({
    components: { Notes, Activity },
    setup() {
        const width = 400
        const mobileBreakPoint = 1024
        const isMobile = computed(() => $vuetify.breakpoint.width < mobileBreakPoint)
        return {
            width,
            isMobile,
            mobileBreakPoint,
            isSidebarActive: state.isSidebarActive,
        }
    },
})
</script>

<style lang="scss" scoped>
.sidebar-row {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    justify-content: stretch;
    align-items: stretch;
    padding: 0;
}
.sidebar-column {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-items: flex-start;
    align-items: stretch;
}
</style>
