import { Box, Button, createStyles, makeStyles } from "@material-ui/core"
import React from "react"

import { colors } from "../styles/color"
import { rootLevelBlock } from "../styles/layout"
import { DownloadButton } from "./download-button"
import { getDownloadLinks } from "./links"

const useStyles = makeStyles((theme) =>
    createStyles({
        cta: {
            width: "100%",
            margin: "0 auto",

            marginTop: 120,
            marginBottom: 160,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: theme.palette.primary.light,

            paddingBottom: 40,
        },
        header: {
            marginTop: 0,
            marginBottom: 0,
            fontWeight: 700,
            color: theme.palette.common.white,

            fontSize: "2.2rem",
            [theme.breakpoints.up("sm")]: {
                fontSize: "3rem",
            },
        },
    }),
)

// const DownloadButton: React.FC<{ href: string }> = ({ href, children }) => {
//     const classes = useStyles()
//     return (
//         <Button
//             target="_blank"
//             rel="noopener noreferrer"
//             href={href}
//             size="large"
//             // variant="contained"
//             // color="primary"
//             className={classes.downloadButton}
//         >
//             {children}
//         </Button>
//     )
// }

// call-to-action
export const CTA: React.FC = () => {
    const classes = useStyles()
    const version = "0.31.2"
    const downloadLinks = getDownloadLinks(version)

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
