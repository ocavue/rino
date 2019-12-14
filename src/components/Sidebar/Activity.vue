<template>
    <div class="sidebar-activity">
        <SidebarColumnHeader>
            <v-spacer />
            <SidebarButton :tbd="true" :icon="icons.cloud" />
            <SidebarButton :tbd="true" :icon="icons.settings" />
        </SidebarColumnHeader>
        <v-divider></v-divider>

        <SidebarColumnBody>
            <v-list-item class="mt-8">
                <v-list-item-content>
                    -
                </v-list-item-content>
            </v-list-item>
        </SidebarColumnBody>
    </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mdiSettingsOutline, mdiCloudOffOutline, mdiCloudOutline } from "@mdi/js"

import { state } from "@/store"
import SidebarColumnHeader from "./SidebarColumnHeader.vue"
import SidebarColumnBody from "./SidebarColumnBody.vue"
import SidebarButton from "./SidebarButton.vue"

const { connected } = state

export default Vue.extend({
    components: { SidebarColumnHeader, SidebarColumnBody, SidebarButton },
    data: () => ({
        sections: {},
        connected: true,
    }),
    computed: {
        icons: function() {
            return {
                settings: mdiSettingsOutline,
                cloud: connected.value ? mdiCloudOutline : mdiCloudOffOutline,
            }
        },
    },
})
</script>

<style lang="scss" scoped>
.sidebar-activity {
    flex: 2;
    border-right-color: rgba(0, 0, 0, 0.12);
    border-right-style: solid;
    border-right-width: 1px;
}
</style>
