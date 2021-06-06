import reactRefresh from "@vitejs/plugin-react-refresh"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
    base: "",
    plugins: [reactRefresh()],
    server: {
        port: 3004,
        hmr: false, // it seems that electron doesn't play well with vite's hmr
    },
    build: {
        sourcemap: true,
        chunkSizeWarningLimit: 5000,
    },
})
