/* istanbul ignore file */

import { NowRequest, NowResponse } from "@vercel/node"
import * as fs from "fs"
import { IncomingMessage } from "http"
import * as https from "https"
import { join } from "path"

const WEB_INDEX_HTML_PATH = join(__dirname, "..", "files", "web.html")
const HOME_INDEX_HTML_PATH = join(__dirname, "..", "files", "home.html")

const WEB_HOST = "rino.app"
const HOME_HOST = "www.rino.app"

function isIndexPage(req: IncomingMessage) {
    return (
        req.url === "/" || req.url === "" || req.url === "/index.html" || req.url === "index.html"
    )
}

function serveHTML(res: NowResponse, filePath: string) {
    res.setHeader("content-type", "text/html; charset=utf-8")
    res.send(fs.readFileSync(filePath))
}

function serveProxy(req: NowRequest, res: NowResponse, proxyHost: string) {
    https.get("https://" + proxyHost + req.url, (sourceResponse) => {
        for (const [key, value] of Object.entries(sourceResponse.headers)) {
            if (key.startsWith("x-vercel") || key === "cache-control") {
                res.setHeader("x-proxy-" + key, value)
            } else {
                res.setHeader("x-proxy-" + key, value)
                res.setHeader(key, value)
            }
        }
        res.setHeader("x-serverless", `packages/server ${new Date()}`)

        // Set status code like 404
        if (sourceResponse.statusCode) {
            res.status(sourceResponse.statusCode)
        }

        if (sourceResponse.statusCode === 404) {
            res.setHeader("cache-control", "no-cache")
        } else {
            res.setHeader("cache-control", "s-maxage=600, stale-while-revalidate")
        }

        sourceResponse.on("data", (d) => {
            res.write(d)
        })
        sourceResponse.on("end", () => {
            res.end()
        })
    })
}

function serve302(res: NowResponse, url: string) {
    res.redirect(302, "https://" + url)
}

function isSignedIn(req: NowRequest): boolean {
    return req.cookies["__rino_sign_in_state_cookie"] === "yes"
}

/*
Target:
    1. as fast as possible
    2. deploy less frequent (Vercel only has 160 function deployments per month for a free account)
*/
export default function (req: NowRequest, res: NowResponse) {
    if (req.headers.host === HOME_HOST) {
        if (isIndexPage(req)) {
            if (isSignedIn(req)) {
                serve302(res, WEB_HOST)
            } else {
                serveHTML(res, HOME_INDEX_HTML_PATH)
            }
        } else {
            serveProxy(req, res, "rino-home.vercel.app")
        }
    } else if (req.headers.host === WEB_HOST) {
        if (isIndexPage(req)) {
            if (!isSignedIn(req)) {
                serve302(res, HOME_HOST)
            } else {
                serveHTML(res, WEB_INDEX_HTML_PATH)
            }
        } else {
            serveProxy(req, res, "rino-web.vercel.app")
        }
    } else {
        // return 302 for non-production url since serverless response cost more than CDN response.
        const matched = /^rino-server-([^.]*).ocavue.vercel.app$/.exec(req.headers.host)
        if (matched) {
            const branch = matched[1]
            const type = isSignedIn(req) ? "web" : "home"
            serve302(res, `rino-${type}-${branch}.ocavue.vercel.app`)
        } else {
            serve302(res, HOME_HOST)
        }
    }
}
