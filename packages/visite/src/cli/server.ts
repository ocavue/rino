import connect from "connect"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { resolve } from "path"
import { createServer as createViteServer, ModuleNode } from "vite"

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
        plugins: [visitePlugin()],
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

            let html = htmlTemplate

            html = await vite.transformIndexHtml(url, html)

            const entryServerPath = toAbsolute("../../app/entry-server.jsx")
            const mod = await vite.ssrLoadModule(entryServerPath)

            const modules = vite.moduleGraph.getModulesByFile(entryServerPath)
            const preloadLinks = modules ? renderPreloadLinks(modules) : ""

            const render: ServerEntry = mod.render
            html = await injectHtml(render, url, html)
            html = html.replace("<!--visite-placeholder-preload-links-->", preloadLinks)
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

function renderPreloadLinks(modules: Set<ModuleNode>) {
    const results: string[] = []
    const deps = new Set<string>()
    modules.forEach((mod) => deps.add(mod.url))
    collectPreloadLinks(modules, deps).forEach((url) => {
        results.push(renderPreloadLink(url))
    })
    return results.join("\n    ")
}

function collectPreloadLinks(modules: Set<ModuleNode>, deps = new Set<string>(), urls = new Set<string>()) {
    for (const mod of modules) {
        if (urls.has(mod.url) || !deps.has(mod.url)) {
            continue
        }
        urls.add(mod.url)
        for (const dep of mod.ssrTransformResult?.deps ?? []) {
            deps.add(dep)
        }
        if (mod.importedModules.size > 0) {
            collectPreloadLinks(mod.importedModules, deps, urls)
        }
    }
    return urls
}

const JS_FILE_REGEX = /[mc]?[tj]sx?$/

// Copied from https://github.com/vitejs/vite/blob/875fc116a0c74d5485e61a3b8c4b5bcc5d8bc842/playground/ssr-vue/src/entry-server.js#L50
function renderPreloadLink(url: string) {
    if (JS_FILE_REGEX.test(url)) {
        return `<link rel="modulepreload" crossorigin href="${url}">`
    } else if (url.endsWith(".css")) {
        return `<link rel="stylesheet" href="${url}">`
    } else if (url.endsWith(".woff")) {
        return `<link rel="preload" href="${url}" as="font" type="font/woff" crossorigin>`
    } else if (url.endsWith(".woff2")) {
        return `<link rel="preload" href="${url}" as="font" type="font/woff2" crossorigin>`
    } else if (url.endsWith(".gif")) {
        return `<link rel="preload" href="${url}" as="image" type="image/gif">`
    } else if (url.endsWith(".jpg") || url.endsWith(".jpeg")) {
        return `<link rel="preload" href="${url}" as="image" type="image/jpeg">`
    } else if (url.endsWith(".png")) {
        return `<link rel="preload" href="${url}" as="image" type="image/png">`
    } else {
        return `<!--unknown preload link ${url}-->`
    }
}

export { createServer }
