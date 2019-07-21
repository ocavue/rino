import Vue from "vue"
import VueRouter from "vue-router"

import App from "./src/App.vue"
import NotFound from "./src/components/NotFound.vue"

Vue.use(VueRouter)

const router = new VueRouter({
    mode: "history",
    routes: [
        {
            name: "index",
            path: "/",
        },
        {
            name: "not found",
            path: "*",
            component: NotFound,
        },
    ],
})

new Vue({
    render: h => h(App),
    router,
}).$mount("#app")
