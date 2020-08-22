// This file is only for development. It's not a part of the package.

import React from "react"
import ReactDOM from "react-dom"

import snapshot from "./assets/share/snapshot-mac.png"
import Homepage from "./Homepage"

ReactDOM.render(
    <Homepage hero={{ imageProps: { src: snapshot } }} />,
    document.getElementById("app"),
)
