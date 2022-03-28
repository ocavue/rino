/// <reference types="vitest" />
// @ts-check

import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig((env) => ({
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./test/setup-vitest.ts"],
        include: ["./test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        coverage: {
            reporter: ["text-summary", "json", "html"],
        },
        deps: {
            fallbackCJS: true,
            inline: [/floating-ui/],
        },
    },
}))
