// @ts-check

import { build } from "esbuild"
import { nodeExternalsPlugin } from "esbuild-node-externals"

/**
 * @param {import('esbuild').BuildOptions} options
 */
async function main(options) {
    const watch = process.argv.slice(2).includes("--watch")

    await build({
        watch: watch
            ? {
                  onRebuild(error, result) {
                      const date = new Date().toISOString().split("T")[1].split("Z")[0]
                      if (error) {
                          console.log(`[esbuild] ${date} error found`)
                      } else {
                          console.log(`[esbuild] ${date} watch build succeeded`)
                      }
                  },
              }
            : false,
        plugins: [nodeExternalsPlugin()],
        splitting: true,
        ...options,
    })

    if (watch) {
        console.log("[esbuild] watching...")
    }
}

main({
    entryPoints: { "rino-editor": "./src/index.ts" },
    outExtension: { ".js": ".mjs" },
    outdir: "./dist/",
    bundle: true,
    format: "esm",
    sourcemap: true,
})
