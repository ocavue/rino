// Import Global CSS
// https://github.com/zeit/next.js/blob/v9.2.0/errors/css-global.md
import "../../../../node_modules/prosemirror-tables/style/tables.css"
import "../../../../node_modules/prosemirror-view/style/prosemirror.css"
import "../../src/style/develop.css"
import "../../src/editor/theme/github.scss"

import Head from "next/head"
import React from "react"

import App from "src/views/App"

export default function Root<T>({
    Component,
    pageProps,
}: {
    Component: React.FC<T>
    pageProps: T
}) {
    React.useEffect(() => {
        // Copy from https://github.com/mui-org/material-ui/blob/v4.11.0/examples/nextjs/pages/_app.js#L11
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector("#jss-server-side")
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles)
        }
    }, [])

    return (
        <>
            <Head>
                <title>Rino</title>
            </Head>
            <App>
                <Component {...pageProps} />
            </App>
        </>
    )
}
