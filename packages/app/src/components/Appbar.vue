<template>
    <div>
        <div class="appbar" :style="`left: ${computedLeft}px;`">
            <v-btn icon :ripple="false" @click="toggleDrawer">
                <v-icon>{{ icons.mdiMenu }}</v-icon>
            </v-btn>
        </div>
        <div v-if="items" class="appbar" style="right: 14px;">
            <v-menu bottom left>
                <template v-slot:activator="{ on }">
                    <v-btn icon :ripple="false" v-on="on">
                        <v-icon>{{ icons.mdiDotsVertical }}</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item v-for="(operation, name) in items" :key="name" @click="operation">
                        <v-list-item-title>{{ name }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue"

import { mdiMenu, mdiDotsVertical } from "@mdi/js"
import { Note } from "../controller"

export default Vue.extend({
    name: "App",
    props: {
        note: { type: Note, required: false, default: null },
        email: { type: String, required: false, default: null },
    },
    data: (): {
        icons: Record<string, string>
    } => ({
        icons: { mdiMenu, mdiDotsVertical },
    }),
    computed: {
        computedLeft: function(): number {
            return this.$vuetify.application.left + 14
        },
        items: function(): Record<string, () => void> | null {
            if (this.email) {
                const items: Record<string, () => void> = {}
                if (this.note) {
                    items["Share"] = () => window.alert("TODO")
                    items["Delete"] = () => this.$emit("delete-note", this.note)
                }
                items["Sign Out"] = () => this.$emit("sign-out")
                return items
            }
            return null
        },
    },
    methods: {
        toggleDrawer: function() {
            this.$emit("toggle-drawer")
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
}
</style>
