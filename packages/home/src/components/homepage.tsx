import { createStyles, CssBaseline, Divider, makeStyles, ThemeProvider } from "@material-ui/core"
import React, { FC, useCallback, useState } from "react"

import { theme } from "../styles/theme"
import { Appbar } from "./appbar"
import { CTA } from "./cta"
import { DownloadDialog } from "./download-dialog"
import { Footer } from "./footer"
import { Headline } from "./headline"
import { Hero, HeroProps } from "./hero"
import { Warning } from "./warning"

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

    const [openDownloadDialog, setOpenDownloadDialog] = useState(false)
    const handleCloseDownloadDialog = useCallback(() => setOpenDownloadDialog(false), [])
    const handleOpenDownloadDialog = useCallback(() => setOpenDownloadDialog(true), [])

    return (
        <div className={classes.root} data-testid="homepage_root">
            <Appbar />
            <Divider />
            <Warning />
            <Headline />
            <Hero {...props.hero} />
            <CTA handleOpenDownloadDialog={handleOpenDownloadDialog} />
            <Divider />
            <Footer />
            <DownloadDialog open={openDownloadDialog} handleClose={handleCloseDownloadDialog} />
        </div>
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
