// @ts-check

import reactRefresh from "@vitejs/plugin-react-refresh"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig((env) => ({
    base: "",
    plugins: [reactRefresh()],
    server: {
        port: 3004,
        hmr: false, // it seems that electron doesn't play well with vite's hmr
    },
    build: {
        /*
        test in 2021-06-08

        | sourcemap | minify  | size | time |
        | --------- | ------- | ---- | ---- |
        | false     | esbuild | 1.4M | 14s  |
        | false     | terser  | 1.3M | 27s  |
        | false     | false   | 2.7M | 16s  |
        | true      | esbuild | 6.5M | 15s  |
        | true      | terser  | 6.7M | 29s  |
        | true      | false   | 8.1M | 18s  |

        */
        minify: "esbuild",
        sourcemap: true,
        chunkSizeWarningLimit: 5000,
        outDir: "./dist",
        emptyOutDir: true,
    },
    define: {
        "process.env.NODE_ENV": JSON.stringify(env.mode === "production" ? "production" : "development"),
        "process.process.platform": JSON.stringify(process.platform),
    },
}))
