import { Button, Hidden, Toolbar } from "@mui/material"
import createStyles from "@mui/styles/createStyles"
import makeStyles from "@mui/styles/makeStyles"
import React, { FC } from "react"

import { rootLevelBlock } from "../styles/layout"
import { AppbarLogo } from "./appbar-logo"

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {},
        flexGrow: {
            flexGrow: 1,
        },
        navigationContainer: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        },
        toolbar: {
            ...rootLevelBlock,
            padding: theme.spacing(0, 2),

            height: 80,
            [theme.breakpoints.up("md")]: {
                height: 96,
            },
        },
        button: {
            fontSize: "1.1rem",
        },
    }),
)

const Appbar: FC<{ handleOpenDownloadDialog: () => void }> = ({ handleOpenDownloadDialog }) => {
    const classes = useStyles()

    return (
        <Toolbar disableGutters className={classes.toolbar}>
            <a href="/" title="rino">
                <AppbarLogo />
            </a>
            <div className={classes.flexGrow} />
            <Hidden smDown>
                <Button className={classes.button} size="large" onClick={handleOpenDownloadDialog}>
                    Download
                </Button>
            </Hidden>
        </Toolbar>
    )
}

export { Appbar }
