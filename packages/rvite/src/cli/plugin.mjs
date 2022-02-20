import { html } from "./html.mjs"
import { preRenderOne } from "./pre-render.mjs"
import { rollupInput } from "./utils.mjs"

const rvitePlugin = () => {
    return {
        name: "vite-plugin-rvite",
        enforce: "pre",

        config(config) {
            // console.log("config:", config)

            config.build = config.build || {}
            config.build.rollupOptions = config.build.rollupOptions || {}
            config.build.rollupOptions.input = rollupInput
        },

        resolveId(id) {
            // console.log("resolve id", id)

            if (id.endsWith(".html")) {
                return id
            }

            return null
        },
        async load(id) {
            if (id.endsWith(".html")) {
                return html
            }
        },
        async transform(src, id) {
            // console.log("_code", (_code || ""))

            if (id.endsWith(".html")) {
                let url = id
                    .replace(/^\.\//, "/")
                    .replace(/\.html$/, "")
                    .replace(/\/index$/g, "/")

                return {
                    code: preRenderOne(url, src),
                    map: null,
                }
            }
        },
    }
}

export default rvitePlugin
