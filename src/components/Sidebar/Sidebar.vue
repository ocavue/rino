<template>
    <v-navigation-drawer
        v-model="isSidebarActive"
        app
        left
        class="sidebar"
        data-testid="sidebar"
        width="400"
    >
        <div class="sidebar-row">
            <Activity class="sidebar-column" />
            <Notes class="sidebar-column" />
        </div>
    </v-navigation-drawer>
</template>

<script lang="ts">
import { createComponent } from "@vue/composition-api"
import { isSidebarActive } from "@/store"
import Notes from "./Notes.vue"
import Activity from "./Activity.vue"

export default createComponent({
    components: { Notes, Activity },
    setup() {
        return {
            isSidebarActive,
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
