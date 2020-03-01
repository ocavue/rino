import { FC } from "react"

import { ProsemirrorDevTools } from "@remirror/dev"

let DevTools: FC = () => null

// Webpack will remove this in production mode
if (process.env.NODE_ENV === "development") {
    if (process.env.REACT_APP_PROSEMIRROR_DEV_TOOLS) {
        DevTools = ProsemirrorDevTools
    }
}

export { DevTools }
