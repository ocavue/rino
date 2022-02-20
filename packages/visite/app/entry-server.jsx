import React, { StrictMode } from "react"
import ReactDOMServer from "react-dom/server"
import { HelmetProvider } from "react-helmet-async"
import { StaticRouter } from "react-router-dom/server"

import { App } from "./load-app.mjs"
import { buildPageRoutes } from "./routes.jsx"

export async function render(url, context) {
    const PageRoutes = await buildPageRoutes(url)

    return ReactDOMServer.renderToString(
        <StrictMode>
            <HelmetProvider context={context}>
                <StaticRouter location={url}>
                    <App Component={PageRoutes}></App>
                </StaticRouter>
            </HelmetProvider>
        </StrictMode>,
    )
}
