import reactRefresh from "@vitejs/plugin-react-refresh"
import { defineConfig } from "vite"

/**
 By default, vite optimizes and packs all the necessary dependencies into your bundle,
 so there is no need to supply them in your application as a node module.
 Unfortunately, vite cannot optimize any dependencies:
 Some that are designed for a node environment may not work correctly after optimization.
 Therefore, such dependencies should be marked as "external":
 they will not be optimized, will not be included in your bundle, and will be delivered as a separate node module.
*/
export const external = ["electron", "electron-updater"]

// https://vitejs.dev/config/
export default defineConfig({
    base: "",
    plugins: [reactRefresh()],
    server: { port: 3002 },
    build: {
        rollupOptions: {
            external,
        },
        chunkSizeWarningLimit: 50_000,
    },
})