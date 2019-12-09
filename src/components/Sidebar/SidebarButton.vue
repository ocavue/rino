<template>
    <v-btn :disabled="disabled" :ripple="false" icon @click="clickIcon">
        <v-icon>{{ icon }}</v-icon>
    </v-btn>
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({
    props: {
        disabled: {
            type: Boolean,
            required: false,
            default: false,
        },
        icon: {
            type: String,
            required: true,
        },
        tbd: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    methods: {
        clickIcon(e: MouseEvent | KeyboardEvent) {
            if (this.tbd) {
                alert("TBD")
            } else {
                this.$emit("click", e)
            }
        },
    },
})
</script>
