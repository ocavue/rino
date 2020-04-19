import { Button, createStyles, IconButton, makeStyles, Snackbar, Theme } from "@material-ui/core"
import CloseIcon from "@material-ui/icons/Close"
import NextLink from "next/link"
import React from "react"

import { SIGN_IN_SNACKBAR_HIDE_DELAY, SIGN_IN_SNACKBAR_SHOW_DELAY } from "src/constants"
import { StoreContainer } from "src/store"

type SnackbarState = "off" | "full" | "dense"

const closeDelay = 300

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        denseRoot: {
            minWidth: "auto",
        },
        button: {
            // When using a light theme, the snackbar's background color is dark by default, so
            // we choice a light color for the button in this case.
            color:
                theme.palette.type === "light"
                    ? theme.palette.secondary.light
                    : theme.palette.secondary.dark,
        },
    })
})

const DenseSignInSnackbar: React.FC<{
    setState: React.Dispatch<React.SetStateAction<SnackbarState>>
    open: boolean
}> = ({ setState, open }) => {
    const expand = () => {
        setState("off")
        setTimeout(() => setState("full"), closeDelay)
    }
    const classes = useStyles()
    return (
        <Snackbar
            open={open}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            data-testid="dense-sign-in-snack-bar"
            ContentProps={{ classes: { root: classes.denseRoot } }}
            message={
                <span>
                    <Button
                        component="a"
                        size="small"
                        data-testid="dense-sign-in-snack-bar-button"
                        onClick={expand}
                        classes={{ root: classes.button }}
                    >
                        Sign Up
                    </Button>
                </span>
            }
        />
    )
}

const FullSignInSnackbar: React.FC<{
    setState: React.Dispatch<React.SetStateAction<SnackbarState>>
    open: boolean
}> = ({ setState, open }) => {
    const close = () => {
        setState("off")
        setTimeout(() => setState("dense"), closeDelay)
    }
    const classes = useStyles()
    return (
        <Snackbar
            open={open}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            onClose={close}
            // `autoHideDuration` is the number of milliseconds to wait before automatically
            // calling the onClose function. onClose should then set the state of the open
            // prop to hide the Snackbar.
            autoHideDuration={SIGN_IN_SNACKBAR_HIDE_DELAY}
            data-testid="full-sign-in-snack-bar"
            message={
                <span>
                    You are in anonymity mode. All changes will not be saved.{" "}
                    <NextLink href="/sign-in">
                        <a data-testid="full-sign-in-snack-bar-button" className={classes.button}>
                            Sign Up
                        </a>
                    </NextLink>{" "}
                    a free account now!
                </span>
            }
            action={
                <IconButton
                    key="close"
                    aria-label="close"
                    color="inherit"
                    onClick={close}
                    size="small"
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            }
        />
    )
}

export const SignInSnackbar: React.FC = () => {
    const {
        state: { loadingUser },
        auth: { user },
    } = StoreContainer.useContainer()

    const [state, setState] = React.useState<SnackbarState>("off")

    React.useEffect(() => {
        if (!user && !loadingUser) {
            const timeout = setTimeout(() => setState("full"), SIGN_IN_SNACKBAR_SHOW_DELAY)
            return () => clearTimeout(timeout)
        }
    }, [loadingUser, setState, user])

    return (
        <>
            <FullSignInSnackbar setState={setState} open={state === "full"} />
            <DenseSignInSnackbar setState={setState} open={state === "dense"} />
        </>
    )
}
