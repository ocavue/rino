import { Button, createStyles, Hidden, makeStyles, Toolbar } from "@material-ui/core"
import React, { FC } from "react"

import { rootLevelBlock } from "../styles/layout"
import { AppbarLogo } from "./appbar-logo"
import { DOWNLOAD_LINK, GITHUB_LINK } from "./links"

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

const Appbar: FC = () => {
    const classes = useStyles()

    return (
        <Toolbar disableGutters className={classes.toolbar}>
            <a href="/" title="rino">
                <AppbarLogo />
            </a>
            <div className={classes.flexGrow} />
            <Hidden xsDown>
                <Button target="_blank" rel="noopener noreferrer" className={classes.button} size="large" href={DOWNLOAD_LINK}>
                    Download
                </Button>
                <Button target="_blank" rel="noopener noreferrer" className={classes.button} size="large" href={GITHUB_LINK}>
                    Github
                </Button>
            </Hidden>
        </Toolbar>
    )
}

export { Appbar }
