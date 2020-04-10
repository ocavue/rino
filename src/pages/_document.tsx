import Document, { Head, Html, Main, NextScript } from "next/document"
import React from "react"

class MyDocument extends Document {
    render() {
        const host = "https://rino.app"
        const image = host + "/img/icons/android-chrome-512x512.png"
        const description = "WYSIWYG Markdown Editor"

        return (
            <Html lang="en">
                {/* prettier-ignore */}
                <Head>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    <meta name="description" content={description} />

                    {/* PWA */}
                        <link rel="manifest" href="/manifest.json" />
                        {/*
                        > Always specify the theme color using the meta tag. Even though it can also be declared in the web app manifest file:
                        > - Browsers only acknowledge the value from the web app manifest file once the user has added the page to their home screen.
                        > - The theme-color meta tag overwrites the value specified in the web app manifest file so it allows for better individual page level customization.
                        https://webhint.io/docs/user-guide/hints/hint-meta-theme-color/
                        */}
                        {/* This color is the default address bar of Chrome */}
                        <meta name="theme-color" content="#e6eaed"></meta>

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
