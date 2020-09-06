import { createStyles, makeStyles } from "@material-ui/styles"
import React from "react"

import { useAuthLinks } from "../hooks"
import { breakpoints } from "../styles/breakpoint"
import { Button } from "./button"

const useStyles = makeStyles(
    createStyles({
        appbarAuth: {
            display: "none",
            alignItems: "center",
            justifyContent: "flex-end",
            marginLeft: "2rem",

            [breakpoints.up.sm]: {
                display: "flex",
            },
        },
    }),
)

export const AppbarAuth: React.FC = () => {
    const classes = useStyles()
    const { signInLink, signUpLink } = useAuthLinks()
    return (
        <div className={classes.appbarAuth}>
            <Button href={signInLink} testid="homepage_signin_btn" ariaLabel="Sign in">
                Sign in
            </Button>
            <span style={{ width: "8px" }} />
            <Button href={signUpLink} testid="homepage_signup_btn" ariaLabel="Sign up" primary>
                Sign up
            </Button>
        </div>
    )
}
