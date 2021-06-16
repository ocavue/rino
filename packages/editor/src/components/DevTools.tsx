import { ProsemirrorDevTools } from "@remirror/dev"
import { FC } from "react"

let DevTools: FC = () => null

// Webpack will remove this in production mode
function initDevTools() {
    try {
        if (process.env.NODE_ENV === "development") {
            DevTools = ProsemirrorDevTools
        }
    } catch (error) {
        DevTools = () => null
        console.warn("failed to load Devtools:", error)
    }
}

initDevTools()

export default DevTools
