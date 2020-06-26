import { createStyles, makeStyles, Theme } from "@material-ui/core"
import React from "react"

import { Appbar } from "src/components/Appbar"
import { Content } from "src/components/Content"
import { Drawer } from "src/components/Drawer"
import { SignInSnackbar } from "src/components/SignInSnackbar"

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        root: {
            height: "100vh",
            width: "100vw",
        },
    })
})

export default function Workspace() {
    const classes = useStyles()
    return (
        <div className={classes.root} data-testid="index">
            <Appbar />
            <Drawer />
            <Content />
            <SignInSnackbar />
        </div>
    )
}
