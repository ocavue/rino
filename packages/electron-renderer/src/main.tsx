import React, { FC } from "react"
import { createRoot } from "react-dom/client"

import Workbench from "./Workbench"

const App: FC = () => {
    return <Workbench />
}

const root = document.getElementById("root")
if (!root) {
    throw new Error("Root element not found")
}

createRoot(root).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
