/* Copyright (c) 2020-present ocavue@gmail.com */

import { createStyles, makeStyles } from "@material-ui/styles"
import React from "react"

import { breakpoints } from "../styles/breakpoint"
import { colors } from "../styles/color"
import { Logo } from "./logo"

const useStyles = makeStyles(
    createStyles({
        root: {
            display: "flex",
            alignItems: "center",
        },
        logo: {
            height: "48px",
            width: "48px",
            [breakpoints.up.sm]: {
                height: "3rem",
            },
        },
        text: {
            lineHeight: "1.5rem",
            fontWeight: 500,
            color: colors.gray700,
            transitionProperty: "color",
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
            transitionDuration: "150ms",

            fontSize: "1.25rem",
            paddingLeft: "1rem",

            "&:hover": {
                color: colors.gray900,
            },
            "&:focus": {
                outline: "0",
                color: colors.gray900,
            },
            [breakpoints.up.sm]: {
                paddingLeft: "1.5rem",
                fontSize: "1.5rem",
            },
        },
    }),
)

export const AppbarLogo: React.FC = () => {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <Logo className={classes.logo} />
            <span className={classes.text}>Rino</span>
        </div>
    )
}
