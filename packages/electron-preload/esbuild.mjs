// @ts-check

import { build } from "esbuild"

build({
    entryPoints: ["./src/index.ts"],
    outfile: "./dist/electron-preload.js",
    bundle: true,
    platform: "node",
    target: "node16",
    external: ["electron"],
    sourcemap: true,
    watch: process.argv.slice(2).includes("--watch"),
    logLevel: "info",
}).catch((err) => {
    console.error(err)
    process.exit(1)
})
