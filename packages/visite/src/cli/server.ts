import connect from "connect"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { resolve } from "path"
import { createServer as createViteServer } from "vite"

import { html as htmlTemplate } from "./html.js"
import { injectHtml } from "./inject-html.js"
import visitePlugin from "./plugin.js"
import type { ServerEntry } from "./types"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const toAbsolute = (p: string) => resolve(__dirname, p)

process.env.MY_CUSTOM_SECRET = "API_KEY_qwertyuiop"

async function createServer(root = process.cwd()) {
    console.log("[createServer] root:", root)

    const app = connect()

    /**
     * @type {import('vite').ViteDevServer}
     */
    const vite = await createViteServer({
        root,
        plugins: [visitePlugin],
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
            const url = req.originalUrl ?? req.url ?? ""

            console.log("[server.mjs] url:", url)

            let template
            // always read fresh template in dev
            template = htmlTemplate
            template = await vite.transformIndexHtml(url, template)
            // const myComponent = (await vite.ssrLoadModule("/src/components/counter.jsx")).default
            // console.log("myComponent:", myComponent)
            // console.log("myComponent.viteHOOKS:", myComponent.viteHOOKS)
            const render: ServerEntry = (await vite.ssrLoadModule(toAbsolute("../../app/entry-server.jsx"))).render
            const html = await injectHtml(render, url, template)
            // if (context.url) {
            //     // Somewhere a `<Redirect>` was rendered
            //     return res.redirect(301, context.url)
            // }
            res.statusCode = 200
            res.setHeader("Content-Type", "text/html")
            res.end(html)
        } catch (err) {
            if (err instanceof Error) {
                vite.ssrFixStacktrace(err)
                console.log(err.stack)
                res.statusCode = 500
                res.end(err.stack)
            } else {
                console.log(err)
                res.end(String(err))
            }
        }
    })

    return { app, vite }
}

export { createServer }
