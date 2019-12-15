import Vue from "vue"
import Vuetify from "vuetify/lib"
// import { Framework } from "vuetify/lib"
import { Framework as VuetifyFramework } from "vuetify"

Vue.use(Vuetify)

const vuetify = new Vuetify({
    icons: {
        iconfont: "mdiSvg",
    },
})

export default vuetify

// `$vuetify` is same as `this.$vuetify` in Vue v2.
export const $vuetify: VuetifyFramework = vuetify.framework
