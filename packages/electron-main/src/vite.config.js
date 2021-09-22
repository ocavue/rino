// @ts-check

import builtinModules from "builtin-modules"
import { execSync } from "node:child_process"
import { defineConfig } from "vite"

process.env.VITE_APP_GIT_COMMIT_SHA = execSync(`git rev-parse --short HEAD`).toString().trim()

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        minify: "esbuild",
        sourcemap: true,
        chunkSizeWarningLimit: 2000,
        outDir: "../dist",
        emptyOutDir: true,

        lib: {
            entry: "./main.ts",
            formats: ["cjs"],
        },
        rollupOptions: {
            external: [...builtinModules, /^node:/, "electron"],
        },
    },
})
