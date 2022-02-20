import connect from "connect"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { resolve } from "path"
import { createServer as createViteServer } from "vite"

import { html as htmlTemplate } from "./html.mjs"
import { injectHtml } from "./inject-html.mjs"
import rvitePlugin from "./plugin.mjs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const toAbsolute = (p) => resolve(__dirname, p)

process.env.MY_CUSTOM_SECRET = "API_KEY_qwertyuiop"

async function createServer(root = process.cwd()) {
    console.log("[createServer] root:", root)

    const app = connect()

    /**
     * @type {import('vite').ViteDevServer}
     */
    let vite = await createViteServer({
        root,
        plugins: [rvitePlugin],
        server: {
            middlewareMode: "ssr",
            watch: {
                // During tests we edit the files too fast and sometimes chokidar
                // misses change events, so enforce polling for consistency
                usePolling: true,
                interval: 100,
            },
        },
    })
    // use vite's connect instance as middleware
    app.use(vite.middlewares)

    app.use(async (req, res) => {
        try {
            const url = req.originalUrl
            console.log("[server.mjs] url:", url)

            let template, render
            // always read fresh template in dev
            template = htmlTemplate
            template = await vite.transformIndexHtml(url, template)
            // const myComponent = (await vite.ssrLoadModule("/src/components/counter.jsx")).default
            // console.log("myComponent:", myComponent)
            // console.log("myComponent.viteHOOKS:", myComponent.viteHOOKS)
            render = (await vite.ssrLoadModule(toAbsolute("../../entry-server.jsx"))).render
            const html = await injectHtml(render, url, template)
            // if (context.url) {
            //     // Somewhere a `<Redirect>` was rendered
            //     return res.redirect(301, context.url)
            // }
            res.statusCode = 200
            res.setHeader("Content-Type", "text/html")
            res.end(html)
        } catch (e) {
            vite.ssrFixStacktrace(e)
            console.log(e.stack)
            res.statusCode = 500
            res.end(e.stack)
        }
    })

    return { app, vite }
}

export { createServer }
