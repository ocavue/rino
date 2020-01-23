import React from "react"

// Import Global CSS
// https://github.com/zeit/next.js/blob/v9.2.0/errors/css-global.md
import "../../node_modules/prosemirror-tables/style/tables.css"
import "../../node_modules/prosemirror-view/style/prosemirror.css"
import "../components/Editor/editor.sass"
import "../components/Editor/markdown.sass"
import "../style/table.sass"
import { noSsrPage } from "src/utils"

const App = noSsrPage(() => import("../views/App"))

export default function Root<T>({
    Component,
    pageProps,
}: {
    Component: React.FC<T>
    pageProps: T
}) {
    return (
        <App>
            <Component {...pageProps} />
        </App>
    )
}
