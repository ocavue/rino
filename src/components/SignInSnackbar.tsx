import { Button, createStyles, IconButton, makeStyles, Snackbar, Theme } from "@material-ui/core"
import CloseIcon from "@material-ui/icons/Close"
import NextLink from "next/link"
import React from "react"

import { SIGN_IN_SNACKBAR_SHOW_DELAY } from "src/constants"
import { StoreContainer } from "src/store"

type SnackbarState = "off" | "full" | "dense"

const closeDelay = 300

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        denseContentRoot: {
            minWidth: "auto",
        },
        denseContentAction: {
            marginLeft: "-8px",
            paddingLeft: "0px",
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
            ContentProps={{
                classes: { root: classes.denseContentRoot, action: classes.denseContentAction },
            }}
            action={
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
            data-testid="full-sign-in-snack-bar"
            message="You are in anonymity mode. All changes will not be saved."
            action={
                <>
                    <NextLink href="/sign-in">
                        <Button
                            component="a"
                            size="small"
                            data-testid="full-sign-in-snack-bar-sign-up-button"
                            classes={{ root: classes.button }}
                        >
                            Sign Up
                        </Button>
                    </NextLink>
                    <IconButton
                        key="close"
                        aria-label="close"
                        color="inherit"
                        onClick={close}
                        size="small"
                        data-testid="full-sign-in-snack-bar-close-button"
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </>
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
