import "../../../../node_modules/prosemirror-tables/style/tables.css"
import "../../../../node_modules/prosemirror-view/style/prosemirror.css"
import "../../../../node_modules/codemirror/lib/codemirror.css"
import "../../../../node_modules/codemirror/theme/nord.css"
import "./styles/index.css"

import React from "react"
import ReactDOM from "react-dom"

import App from "./components/App"

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root"),
)
