/* Copyright (c) 2020-present ocavue@gmail.com */

import { createStyles, makeStyles } from "@material-ui/styles"
import React from "react"

import { breakpoints } from "../styles/breakpoint"
import { colors } from "../styles/color"

const useStyles = makeStyles(
    createStyles({
        root: {
            [breakpoints.up.lg]: {
                textAlign: "center",
            },
            marginTop: "5rem",
            marginBottom: "5rem",
        },
        h1: {
            lineHeight: "1.5",
            margin: "0",
            fontWeight: 700,
            fontSize: "3rem",
            marginTop: ".5rem",
            color: colors.gray900,
            letterSpacing: "-0.025em",
        },
    }),
)

export const Headline: React.FC = () => {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <h1 className={classes.h1}>A better way to write Markdown</h1>
        </div>
    )
}
