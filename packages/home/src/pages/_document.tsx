/* istanbul ignore file */

import { ServerStyleSheets } from "@material-ui/core/styles"
import Document, { DocumentContext, Head, Html, Main, NextScript } from "next/document"
import React from "react"

import { NextMeta } from "@rino.app/next"

class BaseDocument extends Document {
    render() {
        const host = "https://www.rino.app"
        const hasManifest = false
        const description = "WYSIWYG Markdown Editor"

        return (
            <Html lang="en">
                <Head>
                    <NextMeta hasManifest={hasManifest} host={host} description={description} />
                </Head>
                <body>
                    <noscript>
                        <strong>
                            We're sorry but Rino doesn't work properly without JavaScript enabled. Please enable it to continue.
                        </strong>
                    </noscript>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

// copied from https://github.com/mui-org/material-ui/blob/v4.12.1/examples/nextjs/pages/_document.js#L27-L68
//
// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with server-side generation (SSG).
export async function getNextDocumentInitialProps(ctx: DocumentContext) {
    // Resolution order
    //
    // On the server:
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. document.getInitialProps
    // 4. app.render
    // 5. page.render
    // 6. document.render
    //
    // On the server with error:
    // 1. document.getInitialProps
    // 2. app.render
    // 3. page.render
    // 4. document.render
    //
    // On the client
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. app.render
    // 4. page.render

    // Render app and page and get the context of the page with collected side effects.
    const sheets = new ServerStyleSheets()
    const originalRenderPage = ctx.renderPage

    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
        })

    const initialProps = await Document.getInitialProps(ctx)

    return {
        ...initialProps,
        // Styles fragment is rendered after the app and page rendering finish.
        styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
    }
}

BaseDocument.getInitialProps = async (ctx) => {
    return await getNextDocumentInitialProps(ctx)
}

export default BaseDocument
