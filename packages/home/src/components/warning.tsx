import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import React from "react"

import { rootLevelBlock } from "../styles/layout"

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            paddingTop: 16,
            ...rootLevelBlock,
        },
        alert: {
            fontWeight: 600,
            borderColor: theme.palette.warning.dark,
            borderWidth: "2px",
            borderStyle: "solid",
        },
    }),
)

export const Warning = () => {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <div className={classes.alert}>PROJECT STATUS: WORK IN PROGRESS</div>
        </div>
    )
}
