import { Theme, createStyles, makeStyles } from "@material-ui/core"
import React from "react"

import { Appbar } from "src/components/Appbar"
import { Content } from "src/components/Content"
import { Drawer } from "src/components/Drawer"

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        root: {
            display: "flex",
            height: "100vh",
        },
    })
})

export default function Main() {
    const classes = useStyles()
    return (
        <div className={classes.root} data-testid="main">
            <Appbar />
            <Drawer />
            <Content />
        </div>
    )
}
