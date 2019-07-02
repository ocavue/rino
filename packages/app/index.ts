import Vue from "vue"
import App from "./src/App.vue"

new Vue({ render: h => h(App) }).$mount("#app")

async function loadEditor() {
    const editor = await import("../editor/index")
    editor.init()
}

loadEditor()
