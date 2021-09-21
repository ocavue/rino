import { Divider, Theme } from "@mui/material"
import {createStyles} from "@mui/styles"
import {makeStyles } from "@mui/styles"
import React, { FC, useCallback, useState } from "react"

import { Appbar } from "./appbar"
import { CTA } from "./cta"
import { DownloadDialog } from "./download-dialog"
import { Footer } from "./footer"
import { Headline } from "./headline"
import { Hero, HeroProps } from "./hero"
import { Warning } from "./warning"

declare module "@mui/styles/defaultTheme" {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {}
}

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
            <Appbar handleOpenDownloadDialog={handleOpenDownloadDialog} />
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
    return <Home {...props} />
}
