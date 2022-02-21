import { createRequire } from "module"
import { resolve } from "path"

import { injectHtml } from "./inject-html.js"
import type { ServerEntry } from "./types"

const root = process.cwd()

const toAbsolute = (p: string) => resolve(root, p)

let _render: ServerEntry | null = null

function getRender(): ServerEntry {
    if (!_render) {
        const require = createRequire(import.meta.url)
        const render: ServerEntry = require(toAbsolute("./.visite-tmp/dist/entry-server.js")).render
        _render = render
    }
    return _render
}

export async function preRenderOne(url: string, html: string) {
    return injectHtml(getRender(), url, html)
}
