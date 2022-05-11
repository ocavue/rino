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
            reporter: ["json"],
            all: true,
            src: ["./src"],
            exclude: ["**/*.spec.*"],
        },
        deps: {
            inline: ["@lingui/detect-locale"],
        },
    },
}))
