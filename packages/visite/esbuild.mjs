// @ts-check

import { build } from "esbuild"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

var __filename = fileURLToPath(import.meta.url)
var __dirname = path.dirname(__filename)

const pkgJson = JSON.parse(fs.readFileSync(path.join(__dirname, "./package.json"), { encoding: "utf8" }))

const watch = process.argv.slice(2).includes("--watch")

async function main() {
    await build({
        entryPoints: [
            path.join(__dirname, "./src/cli/cli.ts"),

            // lib
            path.join(__dirname, "./src/lib/head.ts"),
        ],
        outdir: path.join(__dirname, "./dist"),
        bundle: true,
        platform: "node",
        format: "esm",
        target: "node12",
        sourcemap: false,
        watch: watch,
        logLevel: "info",
        minify: false,
        external: [...Object.keys(pkgJson.dependencies)],
    })
}

main()
