<template>
    <div class="sidebar-activity">
        <SidebarColumnHeader>
            <v-spacer />
            <SidebarButton :tbd="true" :icon="icons.state" />
            <SettingsMenu />
        </SidebarColumnHeader>
        <v-divider></v-divider>

        <SidebarColumnBody>
            <v-list-item class="mt-8">
                <v-list-item-content>
                    -
                </v-list-item-content>
            </v-list-item>
        </SidebarColumnBody>

        <AboutDialog v-model="isAboutDialogActive" />
    </div>
</template>

<script lang="ts">
import { createComponent, computed } from "@vue/composition-api"
import { mdiCloudOffOutline, mdiCloudOutline } from "@mdi/js"

import { state } from "@/store"
import SidebarColumnHeader from "./SidebarColumnHeader.vue"
import SidebarColumnBody from "./SidebarColumnBody.vue"
import SidebarButton from "./SidebarButton.vue"
import SettingsMenu from "./SettingsMenu.vue"
import AboutDialog from "../AboutDialog.vue"

const { connected, isAboutDialogActive } = state

export default createComponent({
    components: {
        SidebarColumnHeader,
        SidebarColumnBody,
        SidebarButton,
        SettingsMenu,
        AboutDialog,
    },
    setup() {
        const icons = computed(() => ({
            state: connected.value ? mdiCloudOutline : mdiCloudOffOutline,
        }))
        return { icons, isAboutDialogActive }
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
