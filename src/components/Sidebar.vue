<template>
    <v-navigation-drawer v-model="isActive" app left class="sidebar" data-testid="sidebar">
        <template v-slot:prepend>
            <div class="sidebar-btn-container">
                <v-btn
                    v-if="!loading && email"
                    rounded
                    block
                    outlined
                    color="primary"
                    data-testid="sidebar-btn-create-note"
                    @click="createNote"
                >
                    Create note
                </v-btn>
                <v-btn
                    v-else-if="!loading && !email"
                    rounded
                    block
                    outlined
                    color="primary"
                    data-testid="sidebar-btn-sign-in"
                    @click="signIn"
                >
                    Sign In
                </v-btn>
                <v-btn v-else rounded block outlined color="primary"></v-btn>
            </div>
            <v-divider></v-divider>
        </template>

        <v-list class="sidebar-list">
            <v-list-item v-if="loading" class="mt-8">
                <v-list-item-content>
                    <v-progress-circular
                        color="#757575"
                        :indeterminate="true"
                        width="2"
                    ></v-progress-circular>
                </v-list-item-content>
            </v-list-item>

            <template v-for="note in notes">
                <v-list-item
                    :key="`item${note.key}`"
                    :ripple="false"
                    :input-value="currentNote === note"
                    color="primary"
                    data-testid="sidebar-list-item"
                    @click="() => switchNote(note)"
                >
                    <v-list-item-content class="sidebar-list__thumbnail">{{
                        note.thumbnail
                    }}</v-list-item-content>
                </v-list-item>
                <v-divider :key="`divider${note.key}`"></v-divider>
            </template>
        </v-list>
    </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from "vue"
import { Note } from "@/controller"

export default Vue.extend({
    props: {
        notes: {
            type: Array as () => Note[],
            required: true,
        },
        currentNote: {
            type: Note,
            required: false,
            default: undefined,
        },
        loading: {
            type: Boolean,
            required: true,
        },
        email: {
            type: String,
            required: false,
            default: undefined,
        },
        active: {
            type: Boolean,
            required: true,
        },
    },
    data: () => ({
        isActive: false,
    }),
    watch: {
        active(val) {
            if (val !== this.isActive) this.isActive = val
        },
        isActive: function(val) {
            this.$emit("update:active", val)
        },
    },
    created: function() {
        this.isActive = this.active
    },
    methods: {
        createNote: function() {
            this.$emit("create-note")
        },
        switchNote: function(note: Note) {
            this.$emit("switch-note", note)
        },
        signIn: function() {
            this.$router.push({ path: "/login" })
        },
    },
})
</script>

<style lang="scss" scoped>
.sidebar-btn-container {
    padding: 24px;

    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
}

.sidebar-list {
    padding-top: 0;
    padding-bottom: 0;

    &__thumbnail {
        white-space: pre-line; // Line break with `\n`
        height: 72px;
        overflow: hidden;
        padding: 0;
        margin-top: 12px;
        margin-bottom: 12px;

        display: inline-flex;
        align-items: flex-start;
    }
}
</style>
