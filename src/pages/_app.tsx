import Head from "next/head"
import React from "react"

// Import Global CSS
// https://github.com/zeit/next.js/blob/v9.2.0/errors/css-global.md
import "../../node_modules/github-markdown-css/github-markdown.css"
import "../../node_modules/prosemirror-tables/style/tables.css"
import "../../node_modules/prosemirror-view/style/prosemirror.css"
import "../../src/editor/components/markdown.css"
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
            <Head>
                <title>Rino</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Component {...pageProps} />
        </App>
    )
}
