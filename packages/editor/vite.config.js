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
}))