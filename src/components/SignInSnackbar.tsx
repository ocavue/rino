import * as m from "@material-ui/core"
import { SignInSnackbarTimeout } from "src/constants"
import { StoreContainer } from "src/store"
import NextLink from "next/link"
import React from "react"

const SignInSnackbarContent: React.FC = () => (
    <m.SnackbarContent
        message={
            <span>
                You are in anonymity mode. All changes will not be saved.
                <NextLink href="/sign-in">
                    <m.Button
                        component="a"
                        color="primary"
                        size="small"
                        data-testid="sign-in-snack-bar-button"
                    >
                        Sign Up
                    </m.Button>
                </NextLink>{" "}
                a free account now!
            </span>
        }
    />
)

export const SignInSnackbar: React.FC = () => {
    const {
        state: { loadingUser },
        auth: { user },
    } = StoreContainer.useContainer()

    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        if (!user && !loadingUser) {
            const timeout = setTimeout(() => setOpen(true), SignInSnackbarTimeout)
            return () => clearTimeout(timeout)
        }
    }, [loadingUser, setOpen, user])

    return (
        <m.Snackbar
            open={open}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            data-testid="sign-in-snack-bar"
        >
            <SignInSnackbarContent />
        </m.Snackbar>
    )
}
