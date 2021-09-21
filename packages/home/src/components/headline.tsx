import { createStyles } from "@mui/styles"
import { makeStyles } from "@mui/styles"
import React from "react"

import { colors } from "../styles/color"
import { rootLevelBlock } from "../styles/layout"

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            ...rootLevelBlock,
            marginTop: 120,
            marginBottom: 120,

            [theme.breakpoints.up("sm")]: {
                textAlign: "center",
            },
        },
        h1: {
            color: theme.palette.primary.main,

            fontSize: "4rem",
            [theme.breakpoints.up("md")]: {
                fontSize: "5rem",
            },
        },
        h2: {
            fontWeight: 700,
            color: colors.gray900,
            letterSpacing: "-0.025em",

            fontSize: "2.4rem",
            [theme.breakpoints.up("md")]: {
                fontSize: "3rem",
            },
        },
    }),
)

export const Headline: React.FC = () => {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <h1 className={classes.h1}>Rino</h1>
            <h2 className={classes.h2}>A better way to write Markdown</h2>
        </div>
    )
}
