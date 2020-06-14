#!/usr/bin/env node

// A simple static http server

const fs = require("fs")
const http = require("http")
const path = require("path")

function resolveFileAbsPath(reqPath) {
    if (reqPath.indexOf("?") >= 0) {
        reqPath = reqPath.slice(0, reqPath.indexOf("?"))
    }
    if (reqPath === "/") {
        reqPath = "/index.html"
    }
    const dir = path.join(__dirname, "..", "packages", "web", "dist")
    return path.join(dir, reqPath)
}

function logRes(url, filePath, statusCode) {
    const date = new Date()
    console.log(`[${date.toISOString()}] ${statusCode} ${url} -> ${filePath}`)
}

console.log("Serving HTTP on http://localhost:3000/")

http.createServer(function (req, res) {
    let filePath = resolveFileAbsPath(req.url)
    if (!fs.existsSync(filePath)) {
        filePath = resolveFileAbsPath("/404.html")
    } else if (fs.lstatSync(filePath).isDirectory()) {
        filePath = path.join(filePath, "index.html")
    }
    try {
        const content = fs.readFileSync(filePath, "utf-8")
        res.writeHead(200)
        res.end(content)
        logRes(req.url, filePath, 200)
    } catch (err) {
        res.writeHead(500)
        res.end(JSON.stringify(err))
        logRes(req.url, filePath, 500)
    }
}).listen(3000)
