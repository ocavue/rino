import React, { Suspense } from "react"

function DevToolsFactory() {
    console.log("Loading DevTools...")
    return import("./DevTools")
}

const DevTools = React.lazy(DevToolsFactory)

function LazyDevTools() {
    return React.createElement(Suspense, {}, React.createElement(DevTools))
}

export default LazyDevTools
