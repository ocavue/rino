#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */
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
    let dir = path.join(__dirname, "..", "dist")
    return path.join(dir, reqPath)
}

function logRes(url, filePath, statusCode) {
    let date = new Date()
    console.log(`[${date.toISOString()}] ${statusCode} ${url} -> ${filePath}`)
}

console.log("Serving HTTP on http://localhost:8080/")

http.createServer(function(req, res) {
    let filePath = resolveFileAbsPath(req.url)
    if (!fs.existsSync(filePath)) {
        filePath = resolveFileAbsPath("index.html")
    }
    try {
        let content = fs.readFileSync(filePath, "utf-8")
        res.writeHead(200)
        res.end(content)
        logRes(req.url, filePath, 200)
    } catch (err) {
        res.writeHead(500)
        res.end(JSON.stringify(err))
        logRes(req.url, filePath, 500)
    }
}).listen(8080)
