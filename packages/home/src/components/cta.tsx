import { Button } from "@mui/material"
import createStyles from "@mui/styles/createStyles"
import makeStyles from "@mui/styles/makeStyles"
import React from "react"

import { rootLevelBlock } from "../styles/layout"

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            width: "100%",

            marginTop: 120,
            marginBottom: 140,
            paddingTop: 48,
            paddingBottom: 48,

            background: theme.palette.primary.main,
        },
        container: {
            ...rootLevelBlock,

            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        },
        header: {
            marginTop: 0,
            marginBottom: 32,
            fontWeight: 500,
            color: theme.palette.common.white,

            fontSize: "2.2rem",
            [theme.breakpoints.up("sm")]: {
                fontSize: "3rem",
            },
        },

        button: {
            border: "2px solid #fff",
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "19px",
        },
    }),
)

// call-to-action
export const CTA: React.FC<{ handleOpenDownloadDialog: () => void }> = ({ handleOpenDownloadDialog }) => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <div className={classes.container}>
                <h3 className={classes.header}>Download Rino today</h3>
                <Button variant="outlined" className={classes.button} onClick={handleOpenDownloadDialog} size="large">
                    Download Rino
                </Button>
            </div>
        </div>
    )
}
