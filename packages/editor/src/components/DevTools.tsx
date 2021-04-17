// import { ProsemirrorDevTools } from "@remirror/dev"
import { FC } from "react"

const DevTools: FC = () => null

// Webpack will remove this in production mode
function getDevtools() {
    try {
        if (process?.env?.NODE_ENV === "development") {
            if (process?.env?.REACT_APP_PROSEMIRROR_DEV_TOOLS) {
                // DevTools = ProsemirrorDevTools
            }
        }
    } catch (error) {
        console.log("failed to load Devtools:", error)
    }
}

getDevtools()

export default DevTools
