<template>
    <v-btn :disabled="disabled" :ripple="false" icon v-on="myListeners">
        <v-icon>{{ icon }}</v-icon>
    </v-btn>
</template>

<script lang="ts">
import { createComponent, computed } from "@vue/composition-api"
export default createComponent({
    name: "SidebarButton",
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
    setup(props, ctx) {
        function clickIcon(e: MouseEvent | KeyboardEvent) {
            if (props.tbd) {
                alert("TBD")
            } else {
                ctx.emit("click", e)
            }
        }
        const myListeners = computed(() => ({ ...ctx.listeners, click: clickIcon }))
        return { myListeners }
    },
})
</script>
