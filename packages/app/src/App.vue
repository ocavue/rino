<template>
    <div id="containervue">vue is loaded {{ bundler }}</div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
    data() {
        let bundler: string
        bundler = "Parcel!!"
        return {
            bundler: bundler,
        }
    },
})
</script>

<style lang="css" scoped>
#containervue {
    color: green;
}
</style>
