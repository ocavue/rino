import Document, { Head, Html, Main, NextScript } from "next/document"
import React from "react"

class MyDocument extends Document {
    render() {
        const host = "https://rino.app"
        const image = host + "https://rino.app/img/icons/android-chrome-512x512.png"
        const description = "WYSIWYG Markdown Editor"

        return (
            <Html lang="en">
                {/* prettier-ignore */}
                <Head>
                    <title>Rino</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    <meta name="description" content={description} />

                    {/* PWA */}
                        <link rel="manifest" href="/manifest.json" />
                        <meta name="theme-color" content="#000000"></meta>

                    {/* Apple https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html */}
                        <link rel="apple-touch-icon" href="/img/icons/apple-touch-icon-192x192.png" sizes="192x192"></link>
                        <link rel="apple-touch-icon" href="/img/icons/apple-touch-icon-180x180.png" sizes="180x180"></link>
                        <link rel="apple-touch-icon" href="/img/icons/apple-touch-icon-152x152.png" sizes="152x152"></link>
                        <meta name="apple-mobile-web-app-capable" content="yes"></meta>

                    {/* Mircosoft */}
                        <meta name='msapplication-TileColor' content='#222222' />

                    {/* Twitter https://developer.twitter.com/en/docs/tweets/optimize-with-cards/overview/abouts-cards */}
                        <meta name="twitter:card" content="summary" />
                        <meta name="twitter:url" content={host} />
                        <meta name="twitter:title" content="Rino" />
                        <meta name="twitter:description" content={description} />
                        <meta name="twitter:image" content={image} />
                        {/* <meta name="twitter:creator" content="@xxxxxxx" /> */}

                    {/* Open Graph protocol https://ogp.me/ */}
                        <meta property="og:type" content="website" />
                        <meta property="og:title" content="Rino" />
                        <meta property="og:site_name" content="Rino" />
                        <meta property="og:description" content={description} />
                        <meta property="og:url" content={host} />
                        <meta property="og:image" content={image} />

                </Head>
                <body>
                    <noscript>
                        <strong>
                            We're sorry but Rino doesn't work properly without JavaScript enabled.
                            Please enable it to continue.
                        </strong>
                    </noscript>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
