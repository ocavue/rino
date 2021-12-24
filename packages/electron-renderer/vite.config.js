// @ts-check

import reactRefresh from "@vitejs/plugin-react-refresh"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig((env) => ({
    base: "",
    root: "./src/",
    plugins: [reactRefresh()],
    server: {
        port: 3004,
        hmr: false, // it seems that electron doesn't play well with vite's hmr
    },
    build: {
        sourcemap: true,
        chunkSizeWarningLimit: 5000,
        outDir: "../dist",
        emptyOutDir: true,
    },
    define: {
        "process.env.NODE_ENV": JSON.stringify(env.mode === "production" ? "production" : "development"),
        "process.process.platform": JSON.stringify(process.platform),
    },
}))
