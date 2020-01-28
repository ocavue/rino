import * as m from "@material-ui/core"
import React from "react"

export const SignInSnackbar: React.FC<{ classes: Record<string, string> }> = ({ classes }) => {
    const handleClose = () => {}
    const open = true
    const content = (
        <span>
            You are in xx mode. All edit will not be save.
            <m.Link href="/sign-up" underline="always">
                <span> Sign up </span>
            </m.Link>
            a free account now!
        </span>
    )
    return (
        <m.Snackbar
            open={open}
            onClose={handleClose}
            anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
            classes={classes}
        >
            <m.SnackbarContent message={content} />
        </m.Snackbar>
    )
}
