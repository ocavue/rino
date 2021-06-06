import React, { FC } from "react"
import ReactDOM from "react-dom"

import Workbench from "./Workbench"

const App: FC = () => {
    return <Workbench />
}

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root"),
)
