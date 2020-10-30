import { createStyles, makeStyles } from "@material-ui/styles"
import React from "react"

import { useAuthInfo } from "../hooks"
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

const SignInAndSignUp: React.FC<{ signInLink: string; signUpLink: string }> = ({
    signInLink,
    signUpLink,
}) => (
    <>
        <Button animation href={signInLink} testid="homepage_signin_btn" ariaLabel="Sign in">
            Sign in
        </Button>
        <span style={{ width: "8px" }} />
        <Button
            animation
            href={signUpLink}
            testid="homepage_signup_btn"
            ariaLabel="Sign up"
            primary
        >
            Sign up
        </Button>
    </>
)

const GoToTheApp: React.FC<{ appLink: string }> = ({ appLink }) => (
    <Button animation href={appLink} testid="homepage_app_btn" ariaLabel="Go to the app" primary>
        Go to the App
    </Button>
)

export const AppbarAuth: React.FC = () => {
    const classes = useStyles()

    const authInfo = useAuthInfo()

    let child = null
    if (!authInfo.isSSR) {
        const { signInLink, signUpLink, appLink, isSignedIn } = authInfo
        if (isSignedIn) {
            child = <GoToTheApp appLink={appLink} />
        } else {
            child = <SignInAndSignUp signInLink={signInLink} signUpLink={signUpLink} />
        }
    }

    return <div className={classes.appbarAuth}>{child}</div>
}
