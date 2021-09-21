import { Divider } from "@mui/material"
import { Box } from "@mui/system"
import React, { FC, useCallback, useState } from "react"

import { Appbar } from "./appbar"
import { CTA } from "./cta"
import { DownloadDialog } from "./download-dialog"
import { Footer } from "./footer"
import { Headline } from "./headline"
import { Hero, HeroProps } from "./hero"
import { Warning } from "./warning"

type HomepageProps = {
    hero: HeroProps
}

const Home: FC<HomepageProps> = (props) => {
    const [openDownloadDialog, setOpenDownloadDialog] = useState(false)
    const handleCloseDownloadDialog = useCallback(() => setOpenDownloadDialog(false), [])
    const handleOpenDownloadDialog = useCallback(() => setOpenDownloadDialog(true), [])

    return (
        <Box
            sx={{
                position: "relative",

                /**
                 * Reset links to optimize for opt-in styling instead of
                 * opt-out.
                 */
                "& a": {
                    textDecoration: "inherit",
                },
            }}
            data-testid="homepage_root"
        >
            <Appbar handleOpenDownloadDialog={handleOpenDownloadDialog} />
            <Divider />
            <Warning />
            <Headline />
            <Hero {...props.hero} />
            <CTA handleOpenDownloadDialog={handleOpenDownloadDialog} />
            <Divider />
            <Footer />
            <DownloadDialog open={openDownloadDialog} handleClose={handleCloseDownloadDialog} />
        </Box>
    )
}

export const Homepage: FC<HomepageProps> = (props) => {
    return <Home {...props} />
}
