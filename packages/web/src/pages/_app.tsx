// Import Global CSS
// https://github.com/zeit/next.js/blob/v9.2.0/errors/css-global.md
import "../../../../node_modules/prosemirror-tables/style/tables.css"
import "../../../../node_modules/prosemirror-view/style/prosemirror.css"
import "../../src/style/develop.css"

// import "../../src/editor/theme/github.scss"
import Head from "next/head"
import React from "react"

import { DynamicPage } from "src/utils"

const App = DynamicPage("App", () => import("../views/App"))

export default function Root<T>({
    Component,
    pageProps,
}: {
    Component: React.FC<T>
    pageProps: T
}) {
    return (
        <App>
            <Head>
                <title>Rino</title>
            </Head>
            <Component {...pageProps} />
        </App>
    )
}
