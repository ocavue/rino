import React from "react"

const NextMeta: React.FC<{ host: string; hasManifest: boolean; description: string }> = ({ host, hasManifest, description }) => {
    const image = `${host}/share/img/icons/android-chrome-512x512.png`
    return (
        <>
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
            <meta name="msapplication-TileColor" content="#222222" />

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
        </>
    )
}

export default function Head() {
    const host = "https://www.rino.app"
    const hasManifest = false
    const description = "WYSIWYG Markdown Editor"

    return (
        <>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <title>Rino</title>
            <NextMeta hasManifest={hasManifest} host={host} description={description} />
        </>
    )
}
