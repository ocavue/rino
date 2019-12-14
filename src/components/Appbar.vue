<template>
    <div data-testid="appbar">
        <div class="appbar" :style="`left: ${left}px;`">
            <v-btn icon :ripple="false" data-testid="appbar-btn-menu" @click="toggleDrawer">
                <v-icon>{{ icons.mdiMenu }}</v-icon>
            </v-btn>
        </div>
        <div v-if="options.length > 0" class="appbar" :style="`right: ${right}px;`">
            <v-menu bottom left :nudge-width="128" :offset-y="true">
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
    </div>
</template>

<script lang="ts">
import Vue from "vue"
import { auth, edit, state } from "@/store"

import { mdiMenu, mdiDotsVertical } from "@mdi/js"
import { Note } from "@/controller"

interface MenuOption {
    name: string
    testid: string
    action: () => void
}

const horizontalPadding = 16

export default Vue.extend({
    name: "Appbar",
    data: (): {
        icons: Record<string, string>
        deletingNote: boolean
        right: number
    } => ({
        icons: { mdiMenu, mdiDotsVertical },
        deletingNote: false,
        right: horizontalPadding,
    }),
    computed: {
        note: function(): Note | null {
            return edit.note.value
        },
        email: function(): string | null {
            return auth.email.value
        },
        left: function(): number {
            return this.$vuetify.application.left + horizontalPadding
        },
        options: function(): MenuOption[] {
            const options: MenuOption[] = []
            if (this.email) {
                if (this.note || this.deletingNote) {
                    options.push({
                        name: "Share",
                        testid: "share",
                        action: () => window.alert("TODO"),
                    })
                    options.push({
                        name: "Delete",
                        testid: "delete",
                        action: this.deleteNote,
                    })
                }
            }
            return options
        },
    },
    methods: {
        toggleDrawer: function() {
            state.isSidebarActive.value = !state.isSidebarActive.value
        },
        deleteNote: function() {
            if (!this.note) return
            this.deletingNote = true
            this.note.remove()
            // Update edit.notes
            const index = edit.notes.value.indexOf(this.note)
            if (index > -1) edit.notes.value.splice(index, 1)
            // Update edit.note (and this.note)
            if (edit.note.value === this.note) edit.note.value = null
            // Don't change menu options until the menu‘s closing animation is finish
            setTimeout(() => (this.deletingNote = false), 200)
        },
    },
})
</script>

<style lang="scss">
@import "~vuetify/src/styles/styles.sass";
@import "@/style/constants.sass";

// `transition` is copy from node_modules/vuetify/src/components/VToolbar/_variables.scss
.appbar {
    transition: 0.2s map-get($transition, "fast-out-slow-in") left;
    position: fixed;
    top: $app-bar-padding;
    z-index: 1;
}
</style>
