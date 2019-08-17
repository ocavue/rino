import Vue from "vue"
import VueRouter from "vue-router"

import vuetify from "./plugins/vuetify"

import Layout from "./Layout.vue"
const App = () => import("./views/App.vue")
const NotFound = () => import("./views/NotFound.vue")
const Login = () => import("./views/Login.vue")
const FinishSignUp = () => import("./views/FinishSignUp.vue")

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
            path: "/index.html",
            redirect: "/",
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
    vuetify,
}).$mount("#app")
