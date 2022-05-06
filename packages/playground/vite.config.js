/// <reference types="vitest" />
// @ts-check

import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig((env) => ({
    root: "./src/",
    server: { port: 3001 },
    define: {
        "process.env.NODE_ENV": JSON.stringify(env.mode === "production" ? "production" : "development"),
        "process.process.platform": JSON.stringify(process.platform),
    },
    build: {
        outDir: "../dist",
        emptyOutDir: true,
    },
    test: {
        environment: "jsdom",
        include: ["../test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        coverage: {
            reporter: ["text-summary", "json", "html"],
        },
        globals: true,
        testTimeout: 30_000,
        globalSetup: "./test/setup-playwright.ts",
    },
    plugins: [react()],
}))
