// @ts-check

import * as esbuild from "esbuild"

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
    entryPoints: ["./src/index.ts"],
    outfile: "./dist/electron-preload.js",
    bundle: true,
    platform: "node",
    target: "node16",
    external: ["electron"],
    sourcemap: true,
    logLevel: "debug",
    minify: true,
})
