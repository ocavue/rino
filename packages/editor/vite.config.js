/// <reference types="vitest" />
// @ts-check

import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig((env) => ({
    root: "./playground/",
    server: { port: 3001 },
    define: {
        "process.env.NODE_ENV": JSON.stringify(env.mode === "production" ? "production" : "development"),
        "process.process.platform": JSON.stringify(process.platform),
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./test/setup-vitest.ts"],
        include: ["./test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        coverage: {
            reporter: ["text-summary", "json", "html"],
        },
    },
}))
