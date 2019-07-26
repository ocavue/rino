import Vue from "vue"
import VueRouter from "vue-router"

import Layout from "./Layout.vue"
import App from "./pages/App.vue"
import NotFound from "./pages/NotFound.vue"

Vue.use(VueRouter)

const router = new VueRouter({
    mode: "history",
    routes: [
        {
            path: "/",
            redirect: "/e/",
        },
        {
            name: "index",
            path: "/e/",
            component: App,
        },
        {
            name: "not found",
            path: "*",
            component: NotFound,
        },
    ],
})

new Vue({
    render: h => h(Layout),
    router,
}).$mount("#app")
