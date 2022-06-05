/// <reference types="vitest" />
// @ts-check

import react from "@vitejs/plugin-react"
import sourcemaps from "rollup-plugin-sourcemaps"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig((env) => ({
    root: "./src/",
    server: {
        port: 3001,
        open: !process.env.CI,
    },
    define: {
        "process.env.NODE_ENV": JSON.stringify(env.mode === "production" ? "production" : "development"),
        "process.process.platform": JSON.stringify(process.platform),
    },
    build: {
        outDir: "../dist",
        emptyOutDir: true,
        // Disable minify during test to get more precise coverage result.
        minify: process.env.VITEST_PLAYWRIGHT_ENABLE_COVERAGE ? false : "esbuild",
        sourcemap: true,
        rollupOptions: {
            plugins: [sourcemaps({ include: /\.[cm]?(js|ts)x?$/, exclude: /node_modules/ })],
        },
    },
    test: {
        environment: "jsdom",
        include: ["../test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        coverage: {
            reporter: ["json"],
        },
        globals: true,
        testTimeout: 30_000,
        globalSetup: "./test/setup-playwright.ts",
        setupFiles: "../test/setup-playwright-coverage.ts",
    },
    plugins: [react()],
}))
