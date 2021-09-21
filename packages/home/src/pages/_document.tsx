/* eslint-disable react/display-name */
/* istanbul ignore file */

import createEmotionServer from "@emotion/server/create-instance"
import Document, { Head, Html, Main, NextScript } from "next/document"
import React from "react"

import { createEmotionCache } from "../styles/cache"

const NextMeta: React.FC<{ host: string; hasManifest: boolean; description: string }> = ({ host, hasManifest, description }) => {
    const image = `${host}/share/img/icons/android-chrome-512x512.png`
    return (
        /* prettier-ignore */
        <React.Fragment>
            <meta name="description" content={description} />

            {/* PWA */}
                {hasManifest && <link rel="manifest" href="/manifest.json" />}
                {/*
                > Always specify the theme color using the meta tag. Even though it can also be declared in the web app manifest file:
                > - Browsers only acknowledge the value from the web app manifest file once the user has added the page to their home screen.
                > - The theme-color meta tag overwrites the value specified in the web app manifest file so it allows for better individual page level customization.
                https://webhint.io/docs/user-guide/hints/hint-meta-theme-color/
                */}
                {/* This color is the default address bar color of Chrome */}
                <meta name="theme-color" content="#e6eaed"></meta>

            {/* Apple https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html */}
                <link rel="apple-touch-icon" href="/share/img/icons/apple-touch-icon-192x192.png" sizes="192x192"></link>
                <link rel="apple-touch-icon" href="/share/img/icons/apple-touch-icon-180x180.png" sizes="180x180"></link>
                <link rel="apple-touch-icon" href="/share/img/icons/apple-touch-icon-152x152.png" sizes="152x152"></link>
                <meta name="apple-mobile-web-app-capable" content="yes"></meta>

            {/* Mircosoft */}
                <meta name='msapplication-TileColor' content='#222222' />

            {/* Twitter https://developer.twitter.com/en/docs/tweets/optimize-with-cards/overview/abouts-cards */}
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:url" content={host} />
                <meta name="twitter:title" content="Rino" />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={image} />
                <meta name="twitter:creator" content="@xxxxxxx" />

            {/* Open Graph protocol https://ogp.me/ */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Rino" />
                <meta property="og:site_name" content="Rino" />
                <meta property="og:description" content={description} />
                <meta property="og:url" content={host} />
                <meta property="og:image" content={image} />
        </React.Fragment>
    )
}

export default class BaseDocument extends Document {
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

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
BaseDocument.getInitialProps = async (ctx) => {
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

    const originalRenderPage = ctx.renderPage

    // You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
    // However, be aware that it can have global side effects.
    const cache = createEmotionCache()
    const { extractCriticalToChunks } = createEmotionServer(cache)

    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: (App: any) => (props) => <App emotionCache={cache} {...props} />,
        })

    const initialProps = await Document.getInitialProps(ctx)
    // This is important. It prevents emotion to render invalid HTML.
    // See https://github.com/mui-org/material-ui/issues/26561#issuecomment-855286153
    const emotionStyles = extractCriticalToChunks(initialProps.html)
    const emotionStyleTags = emotionStyles.styles.map((style) => (
        <style
            data-emotion={`${style.key} ${style.ids.join(" ")}`}
            key={style.key}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: style.css }}
        />
    ))

    return {
        ...initialProps,
        // Styles fragment is rendered after the app and page rendering finish.
        styles: [...React.Children.toArray(initialProps.styles), ...emotionStyleTags],
    }
}
