import type { Plugin } from "vite"

import { html } from "./html.js"
import { preRenderOne } from "./pre-render.js"
import { rollupInput } from "./utils.js"

const visitePlugin = (): Plugin => {
    return {
        name: "vite-plugin-visite",
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
                const url = id
                    .replace(/^\.\//, "/")
                    .replace(/\.html$/, "")
                    .replace(/\/index$/g, "/")
                const code: string = await preRenderOne(url, src)
                return { code, map: null }
            }
        },
    }
}

export default visitePlugin
