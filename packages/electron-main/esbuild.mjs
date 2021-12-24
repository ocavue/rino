// @ts-check

import { build } from "esbuild"
import { execSync } from "node:child_process"

const RINO_GIT_COMMIT_SHA = execSync(`git rev-parse --short HEAD`).toString().trim()

build({
    entryPoints: ["./src/main.ts"],
    outfile: "./dist/electron-main.js",
    bundle: true,
    platform: "node",
    target: "node16",
    external: ["electron"],
    sourcemap: true,
    watch: process.argv.slice(2).includes("--watch"),
    logLevel: "info",
    define: {
        "process.env.RINO_GIT_COMMIT_SHA": JSON.stringify(RINO_GIT_COMMIT_SHA),
    },
}).catch((err) => {
    console.error(err)
    process.exit(1)
})
