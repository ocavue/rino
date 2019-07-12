import Vue from "vue"
import VueRouter from "vue-router"

import App from "./src/App.vue"
import EditorContainer from "./src/components/EditorContainer.vue"
import NotFound from "./src/components/NotFound.vue"
import Welcome from "./src/components/Welcome.vue"

Vue.use(VueRouter)

const router = new VueRouter({
    mode: "history",
    routes: [
        {
            path: "/",
            component: Welcome,
        },
        {
            path: "/e/:id", // 'e' for 'edit'
            component: EditorContainer,
        },
        {
            path: "*",
            component: NotFound,
        },
    ],
})

new Vue({
    render: h => h(App),
    router,
}).$mount("#app")
