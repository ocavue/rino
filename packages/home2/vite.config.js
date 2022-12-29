import react from "@vitejs/plugin-react-swc"

console.log("loading packages/home2/vite.config.js")

/**
 * @type {import('vite').UserConfig}
 */
const config = {
    plugins: [react()],
    build: {
        minify: false,
        sourcemap: true,
    },
    server: {
        open: true,
    },
}

export default config
