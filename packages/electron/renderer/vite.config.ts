import reactRefresh from "@vitejs/plugin-react-refresh"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
    base: "",
    plugins: [reactRefresh()],
    server: {
        port: 3004,
        hmr: true, // it seems that electron doesn't play well with vite's hmr
    },
    build: {
        chunkSizeWarningLimit: 5000,
    },
})
