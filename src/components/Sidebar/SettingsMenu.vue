<template>
    <v-menu
        v-model="menu"
        :close-on-content-click="true"
        :nudge-width="160"
        :offset-y="true"
        data-testid="sidebar-settings-menu"
    >
        <template v-slot:activator="slotProps">
            <SidebarButton
                :icon="icons.settings"
                data-testid="sidebar-btn-settings"
                v-on="slotProps.on"
            />
        </template>
        <v-card>
            <v-list>
                <v-list-item
                    v-if="user"
                    data-testid="sidebar-settings-menu-item-sign-out"
                    @click="signOut"
                >
                    <v-list-item-content>
                        Sign out
                    </v-list-item-content>
                </v-list-item>
                <v-list-item
                    v-else
                    data-testid="sidebar-settings-menu-item-sign-in"
                    @click="signIn"
                >
                    <v-list-item-content>
                        Sign in / Sign up
                    </v-list-item-content>
                </v-list-item>
                <v-list-item
                    data-testid="sidebar-settings-menu-item-about"
                    @click="showAboutDialog"
                >
                    <v-list-item-content>
                        About Rino
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-card>
    </v-menu>
</template>

<script lang="ts">
import { createComponent, ref } from "@vue/composition-api"
import SidebarButton from "./SidebarButton.vue"
import { mdiSettingsOutline } from "@mdi/js"
import Notes from "./Notes.vue"
import router from "@/router"
import { state, auth } from "@/store"
import { signOut } from "@/controller/auth"

export default createComponent({
    name: "SettingsMenu",
    components: { Notes, SidebarButton },
    setup(props, ctx) {
        const icons = { settings: mdiSettingsOutline }
        const menu = ref(false)
        const showAboutDialog = () => (state.isAboutDialogActive.value = true)
        const signIn = () => router.push({ name: "login" })
        return { icons, menu, showAboutDialog, signIn, signOut, user: auth.user }
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
