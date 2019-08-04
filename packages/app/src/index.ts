import Vue from "vue"
import VueRouter from "vue-router"

import Layout from "./Layout.vue"
import App from "./pages/App.vue"
import NotFound from "./pages/NotFound.vue"
import Login from "./pages/Login.vue"
import FinishSignUp from "./pages/FinishSignUp.vue"

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
            name: "login",
            path: "/login/",
            component: Login,
        },
        {
            name: "finish sign up",
            path: "/finish-sign-up/:random",
            component: FinishSignUp,
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
