<template>
    <v-dialog v-model="isActive" max-width="360">
        <v-card class="about-dialog" data-testid="about-dialog">
            <v-col justify="center" align="center">
                <img src="../assets/logo.png" width="128px" height="128px" />
                <v-row justify="center"><h2>Rino</h2></v-row>
            </v-col>
            <v-card-text>
                <v-row justify="center" data-testid="about-dialog-version">
                    Version {{ version }}
                </v-row>
                <v-row justify="center" data-testid="about-dialog-copyright">
                    Copyright © 2019 Ocavue. All rights reserved.
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import Vue from "vue"
import { version } from "@/controller/config"

const prop = "value"
const event = "input"

export default Vue.extend({
    name: "AboutDialog",
    model: { prop, event },
    props: {
        [prop]: { type: Boolean, required: true },
    },
    data: () => ({
        version,
        isActive: false,
    }),
    watch: {
        [prop]: function(val) {
            this.isActive = val
        },
        isActive: function(val) {
            if (val !== this[prop]) this.$emit(event, val)
        },
    },
})
</script>

<style lang="scss">
.about-dialog {
    padding-top: 16px;
}
</style>
