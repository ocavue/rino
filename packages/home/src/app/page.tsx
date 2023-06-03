"use client"

import { CssBaseline, ThemeProvider } from "@mui/material"
import React from "react"
import snapshot from "../assets/share/snapshot-mac.png"
import { Homepage } from "../components/homepage"
import { theme } from "../styles/theme"

const IndexPage: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />

            <Homepage
                hero={{
                    imageProps: {
                        src: snapshot.src,
                        srcSet: snapshot.srcSet,
                        width: snapshot.width,
                        height: snapshot.height,
                        loading: "lazy",
                    },
                }}
            />
        </ThemeProvider>
    )
}

export default IndexPage
