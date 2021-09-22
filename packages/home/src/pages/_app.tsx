/* istanbul ignore file */

import { CacheProvider, EmotionCache } from "@emotion/react"
import { CssBaseline } from "@mui/material"
import { StyledEngineProvider } from "@mui/material/styles"
import { ThemeProvider } from "@mui/system"
import { AppProps } from "next/app"
import Head from "next/head"
import React from "react"

import { createEmotionCache } from "../styles/cache"
import { theme } from "../styles/theme"

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

interface BaseAppProps extends AppProps {
    emotionCache?: EmotionCache
}

export default function BaseApp(props: BaseAppProps) {
    const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
    return (
        <StyledEngineProvider injectFirst>
            <CacheProvider value={emotionCache}>
                <Head>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    <title>Rino</title>
                </Head>
                <ThemeProvider theme={theme}>
                    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                    <CssBaseline />
                    <Component {...pageProps} />
                </ThemeProvider>
            </CacheProvider>
        </StyledEngineProvider>
    )
}
