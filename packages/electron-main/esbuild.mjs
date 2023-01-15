// @ts-check

import * as esbuild from "esbuild"
import { execSync } from "node:child_process"

const RINO_GIT_COMMIT_SHA = execSync(`git rev-parse --short HEAD`).toString().trim()

/**
 * @param {import('esbuild').BuildOptions} options
 */
async function main(options) {
    const context = await esbuild.context(options)
    const watch = process.argv.slice(2).includes("--watch")

    if (watch) {
        context.watch()
    } else {
        await context.rebuild()
        await context.dispose()
    }
}

main({
    entryPoints: ["./src/main.ts"],
    outfile: "./dist/electron-main.js",
    bundle: true,
    platform: "node",
    target: "node16",
    external: ["electron"],
    sourcemap: true,
    logLevel: "info",
    define: {
        "process.env.RINO_GIT_COMMIT_SHA": JSON.stringify(RINO_GIT_COMMIT_SHA),
    },
    minify: true,
})
