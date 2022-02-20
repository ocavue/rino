import { createRequire } from "module"
import { resolve } from "path"

import { injectHtml } from "./inject-html.mjs"

const root = process.cwd()

const toAbsolute = (p) => resolve(root, p)

let _render = null

function getRender() {
    if (!_render) {
        const require = createRequire(import.meta.url)
        const { render } = require(toAbsolute("./.rvite-tmp/dist/entry-server.js"))
        _render = render
    }
    return _render
}

export async function preRenderOne(url, html) {
    return injectHtml(getRender(), url, html)
}
