/* Copyright (c) 2020-present ocavue@gmail.com */

import { createStyles, makeStyles } from "@material-ui/styles"
import React from "react"

import { useAuthInfo } from "../hooks"
import { colors } from "../styles/color"
import { Button } from "./button"
import { Logo } from "./logo"

const useStyles = makeStyles(
    createStyles({
        cta: {
            marginTop: 144,
            marginBottom: 144,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        },
        logo: {
            height: "6rem",
            width: "auto",
        },
        header: {
            marginTop: 32,
            marginBottom: 32,
            fontSize: "2.25rem",
            lineHeight: "2.5rem",
            fontWeight: 700,
            color: colors.gray900,
        },
    }),
)

// call-to-action
export const CTA: React.FC = () => {
    const classes = useStyles()
    const authInfo = useAuthInfo()

    return (
        <div className={classes.cta}>
            <Logo className={classes.logo} />
            <h2 className={classes.header}>Get started with Rino</h2>
            <Button href={authInfo.signUpLink} testid="homepage_signup_btn" ariaLabel="create_an_account" primary>
                Create an account
            </Button>
        </div>
    )
}
