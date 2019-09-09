<template>
    <div data-testid="appbar">
        <div class="appbar" :style="`left: ${computedLeft}px;`">
            <v-btn icon :ripple="false" data-testid="appbar-btn-menu" @click="toggleDrawer">
                <v-icon>{{ icons.mdiMenu }}</v-icon>
            </v-btn>
        </div>
        <div v-if="options.length > 0" class="appbar" style="right: 14px;">
            <v-menu bottom left>
                <template v-slot:activator="{ on }">
                    <v-btn icon :ripple="false" data-testid="appbar-btn-dots" v-on="on">
                        <v-icon>{{ icons.mdiDotsVertical }}</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item
                        v-for="(option, index) in options"
                        :key="index"
                        :data-testid="`appbar-menu-item-${option.testid}`"
                        @click="option.action"
                    >
                        <v-list-item-title>{{ option.name }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
        <AboutDialog v-model="dialog" />
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"

import AboutDialog from "./AboutDialog.vue"
import { mdiMenu, mdiDotsVertical } from "@mdi/js"
import { Note } from "../controller"

interface MenuOption {
    name: string
    testid: string
    action: () => void
}

export default Vue.extend({
    name: "Appbar",
    components: { AboutDialog },
    props: {
        note: {
            // Add PropType because of this issue:
            // https://github.com/vuejs/vue/issues/8679#issuecomment-473946487
            type: Note as PropType<Note>,
            required: false,
            default: null,
        },
        email: {
            type: String,
            required: false,
            default: null,
        },
    },
    data: (): {
        icons: Record<string, string>
        dialog: boolean
    } => ({
        icons: { mdiMenu, mdiDotsVertical },
        dialog: false,
    }),
    computed: {
        computedLeft: function(): number {
            return this.$vuetify.application.left + 14
        },
        options: function(): MenuOption[] {
            const options: MenuOption[] = []
            if (this.email) {
                if (this.note) {
                    options.push({
                        name: "Share",
                        testid: "share",
                        action: () => window.alert("TODO"),
                    })
                    options.push({
                        name: "Delete",
                        testid: "delete",
                        action: () => this.$emit("delete-note", this.note),
                    })
                }
                options.push({
                    name: "Sign Out",
                    testid: "signout",
                    action: () => this.$emit("sign-out"),
                })
            }
            options.push({
                name: "About",
                testid: "about",
                action: () => this.showDialog(),
            })
            return options
        },
    },
    methods: {
        toggleDrawer: function() {
            this.$emit("toggle-drawer")
        },
        showDialog: function() {
            this.dialog = true
        },
    },
})
</script>

<style lang="scss">
@import "~vuetify/src/styles/styles.sass";

// `transition` is copy from node_modules/vuetify/src/components/VToolbar/_variables.scss
.appbar {
    transition: 0.2s map-get($transition, "fast-out-slow-in") left;
    position: fixed;
    top: 14px;
    z-index: 1;
}
</style>
