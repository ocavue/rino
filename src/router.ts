import Vue from "vue"
import Router from "vue-router"

const Main = () => import("./views/Main.vue")
const NotFound = () => import("./views/NotFound.vue")
const Login = () => import("./views/Login.vue")
const FinishSignUp = () => import("./views/FinishSignUp.vue")

Vue.use(Router)

export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            redirect: "/e/",
        },
        {
            name: "index",
            path: "/e/",
            component: Main,
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
