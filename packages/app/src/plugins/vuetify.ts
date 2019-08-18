import Vue from "vue"
import Vuetify, {
    VApp,
    VBtn,
    VContent,
    VDivider,
    VFlex,
    VIcon,
    VLayout,
    VList,
    VListItem,
    VListItemContent,
    VListItemTitle,
    VMenu,
    VNavigationDrawer,
    VProgressCircular,
    VToolbar,
    VContainer,
} from "vuetify/lib"
import { Ripple } from "vuetify/lib/directives"

import "vuetify/src/styles/main.sass"

Vue.use(Vuetify, {
    components: {
        VApp,
        VBtn,
        VContent,
        VDivider,
        VFlex,
        VIcon,
        VLayout,
        VList,
        VListItem,
        VListItemContent,
        VListItemTitle,
        VMenu,
        VNavigationDrawer,
        VProgressCircular,
        VToolbar,
        VContainer,
    },
    directives: {
        Ripple,
    },
})

export default new Vuetify({
    icons: {
        iconfont: "mdiSvg",
    },
})
