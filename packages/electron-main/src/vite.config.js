// @ts-check

import builtinModules from "builtin-modules"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig((env) => ({
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
            external: [...builtinModules, "electron", "fs/promises"],
        },
    },
}))
