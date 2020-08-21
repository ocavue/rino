// This file is only for development. It's not a part of the package.

import React from "react"
import ReactDOM from "react-dom"

import snapshot from "../public/share/snapshot-mac-1317x762.png"
import Homepage from "./Homepage"

ReactDOM.render(<Homepage hero={{ imageSrc: snapshot }} />, document.getElementById("app"))
