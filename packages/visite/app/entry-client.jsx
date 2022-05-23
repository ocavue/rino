import React, { StrictMode } from "react"
import { hydrateRoot } from "react-dom/client"
import { HelmetProvider } from "react-helmet-async"
import { BrowserRouter } from "react-router-dom"

import { App } from "./load-app.mjs"
import { buildPageRoutes } from "./routes.jsx"

async function main() {
    const url = window.location.pathname
    const PageRoutes = await buildPageRoutes(url)
    hydrateRoot(
        document.getElementById("app"),
        <StrictMode>
            <HelmetProvider>
                <BrowserRouter>
                    <App Component={PageRoutes}></App>
                </BrowserRouter>
            </HelmetProvider>
        </StrictMode>,
    )
}

main()
