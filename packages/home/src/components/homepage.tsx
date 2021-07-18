import { createStyles, CssBaseline, Divider, makeStyles, ThemeProvider } from "@material-ui/core"
import dynamic from "next/dynamic"
import React, { FC } from "react"

import { downloadDialogContainer } from "../hooks/download-dialog"
import { theme } from "../styles/theme"
import { Appbar } from "./appbar"
import { CTA } from "./cta"
import type { DownloadDialogProps } from "./download-dialog"
import { Footer } from "./footer"
import { Headline } from "./headline"
import { Hero, HeroProps } from "./hero"
import { Warning } from "./warning"

const DownloadDialog = dynamic<DownloadDialogProps>(() => import("./download-dialog").then((mod) => mod.DownloadDialog))

const useStyles = makeStyles(
    createStyles({
        root: {
            position: "relative",

            /**
             * Reset links to optimize for opt-in styling instead of
             * opt-out.
             */
            "& a": {
                textDecoration: "inherit",
            },
        },
    }),
)

type HomepageProps = {
    hero: HeroProps
}

const Home: FC<HomepageProps> = (props) => {
    const classes = useStyles()

    return (
        <downloadDialogContainer.Provider>
            <div className={classes.root} data-testid="homepage_root">
                <Appbar />
                <Divider />
                <Warning />
                <Headline />
                <Hero {...props.hero} />
                <CTA />
                <Divider />
                <Footer />
                <DownloadDialog />
            </div>
        </downloadDialogContainer.Provider>
    )
}

export const Homepage: FC<HomepageProps> = (props) => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Home {...props} />
        </ThemeProvider>
    )
}
