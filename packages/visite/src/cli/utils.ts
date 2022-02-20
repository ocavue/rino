import fs from "fs"
import { resolve } from "path"
const root = process.cwd()

const toAbsolute = (p: string) => resolve(root, p)

const filePaths = fs.readdirSync(toAbsolute("src/pages"))
// console.log("pagePaths:", filePaths)

function fileToUrl(filePath: string) {
    const name = filePath.replace(/\.(jsx|js|tsx|ts)$/, "").toLowerCase()
    return name === "index" ? `/` : `/${name}`
}

const routesToPrerender = filePaths.map(fileToUrl)

const fileToUrlMaps: Record<string, string> = {}
const urlToFileMaps: Record<string, string> = {}
const rollupInput: Record<string, string> = {}

for (const filePath of filePaths) {
    const url = fileToUrl(filePath)
    const file = `/src/pages/${filePath}`
    fileToUrlMaps[file] = url
    urlToFileMaps[url] = file

    const name = url.replace(/\/$/, "index").replace(/^\//, "")
    if (name === "_app") {
        continue
    }
    rollupInput[name] = "./" + name + ".html"
}

// console.log("routesToPrerender:", routesToPrerender)
// console.log("fileToUrlMaps:", fileToUrlMaps)
console.log("rollupInput:", rollupInput)

export { routesToPrerender, fileToUrlMaps, urlToFileMaps, rollupInput }
