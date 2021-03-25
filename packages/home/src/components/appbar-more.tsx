/* Copyright (c) 2020-present ocavue@gmail.com */

import { createStyles, makeStyles } from "@material-ui/styles"
import React from "react"

import { breakpoints } from "../styles/breakpoint"
import { MoreIconButton } from "./button"

const useStyles = makeStyles(
    createStyles({
        root: {
            [breakpoints.up.sm]: {
                display: "none",
            },
        },
    }),
)

export const AppbarMore: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <MoreIconButton onClick={onClick} testid="homepage_appbar_more" ariaLabel="More" />
        </div>
    )
}
