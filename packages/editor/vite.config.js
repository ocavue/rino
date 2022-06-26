/// <reference types="vitest" />
// @ts-check

import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig((env) => ({
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./test/setup-vitest.ts"],
        coverage: {
            reporter: ["json", "html"],
            all: true,
            src: ["./src"],
            exclude: ["**/*.spec.*"],
        },
        deps: {},

        // Limit the resources we used in the CI, to avoid out-of-memory errors.
        maxConcurrency: process.env.CI ? 1 : 5,
    },
}))
