import { defineConfig } from "vitest/config"

// https://vitejs.dev/config/
export default defineConfig({
    test: {
        environment: "happy-dom",
        coverage: {
            reporter: ["text-summary", "json", "html"],
        },
        globals: true,
        setupFiles: "./test/setup.ts",
    },
})
