<template>
    <div class="sidebar">
        <center class="sidebar__user">
            <span class="sidebar__user-text">
                {{ email || (loading ? "Loading..." : "Not login") }}
            </span>
            <button v-if="email" class="sidebar__signout-button" @click="signOut">
                Sign Out
            </button>
        </center>
        <button v-if="!email && !loading" class="sidebar__main-button" @click="signIn">
            Sign In
        </button>
        <button v-else class="sidebar__main-button" @click="createNote">
            Create note
        </button>
        <div v-if="loading" class="sidebar__loading">Loading...</div>
        <div
            v-for="note in notes"
            :key="note.id"
            :class="{
                'sidebar-item': true,
                'sidebar-item--active': currentNote === note,
            }"
        >
            <a class="sidebar-item__link" @click="() => switchNote(note)">
                {{ note.id }}
            </a>
            <button @click="() => deleteNote(note)">Delete</button>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue"
import { Note } from "../controller"

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
    },
    methods: {
        createNote: function() {
            this.$emit("create-note")
        },
        switchNote: function(note: Note) {
            this.$emit("switch-note", note)
        },
        deleteNote: function(note: Note) {
            this.$emit("delete-note", note)
        },
        signIn: function() {
            this.$router.push({ path: "/login" })
        },
        signOut: function() {
            this.$emit("sign-out")
        },
    },
})
</script>

<style lang="scss" scoped>
.sidebar {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;

    background-color: #e2e2e2;
    overflow-y: scroll;
    height: 100vh;
    width: 320px;

    &__main-button {
        min-height: 48px; // TODO: not working when window is too short
        height: 48px;
        margin: 16px;
    }

    &__loading {
        padding-top: 48px;
        align-self: center;
    }

    &__user {
        margin-top: 16px;
    }
}
.sidebar-item {
    min-height: 48px;
    border-bottom: 1px solid #b3b3b3;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 8px;
    padding-right: 8px;

    &__link {
        height: 100%;
        flex: 1;
        text-decoration: none;

        display: flex;
        align-items: center;
        color: inherit;
    }

    &--active {
        background: #d31473;
        color: white;
    }
}
</style>
