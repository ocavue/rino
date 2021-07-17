import { createStyles, makeStyles } from "@material-ui/core"
import React from "react"

import { DownloadButton } from "./download-button"

const useStyles = makeStyles((theme) =>
    createStyles({
        cta: {
            width: "100%",

            marginTop: 120,
            marginBottom: 160,
            paddingTop: 48,
            paddingBottom: 48,

            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: theme.palette.primary.light,
        },
        header: {
            marginTop: 0,
            marginBottom: 32,
            fontWeight: 700,
            color: theme.palette.common.white,

            fontSize: "2.2rem",
            [theme.breakpoints.up("sm")]: {
                fontSize: "3rem",
            },
        },
    }),
)

// call-to-action
export const CTA: React.FC = () => {
    const classes = useStyles()
    const version = "0.31.2"

    return (
        <div className={classes.cta}>
            <h3 className={classes.header}>Download Rino today</h3>

            <DownloadButton />

            {/* <Box>v{version}</Box>
            <Box className={classes.downloadButtonWrapper}>
                <DownloadButton href={downloadLinks.mac}>Mac</DownloadButton>
                <DownloadButton href={downloadLinks.win}>Windows</DownloadButton>
                <DownloadButton href={downloadLinks.linux}>Linux</DownloadButton>
            </Box> */}
        </div>
    )
}
