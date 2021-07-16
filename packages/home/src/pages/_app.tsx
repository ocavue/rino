/* istanbul ignore file */

import { AppProps } from "next/app"
import Head from "next/head"
import React from "react"

const BaseApp: React.FC<AppProps> = (props) => {
    const { Component, pageProps } = props

    // https://github.com/mui-org/material-ui/blob/v4.12.1/examples/nextjs/pages/_app.js#L11-L17
    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector("#jss-server-side")
        if (jssStyles) {
            jssStyles.parentElement?.removeChild(jssStyles)
        }
    }, [])

    return (
        <React.Fragment>
            <Head>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <title>Rino</title>
            </Head>
            <Component {...pageProps} />
        </React.Fragment>
    )
}

export default BaseApp
