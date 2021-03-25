/* Copyright (c) 2021-present ocavue@gmail.com */

import { Container, createStyles, LinearProgress, makeStyles, Theme, Typography } from "@material-ui/core"
import React from "react"

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        title: {
            paddingTop: theme.spacing(8),
            paddingBottom: theme.spacing(2),
        },
        submit: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(3),
        },
        form: {
            width: "100%", // Fix IE 11 issue.
            marginTop: theme.spacing(1),
        },
    })
})

type AuthLayoutProps = {
    title: string
    error: string
    progressing: boolean
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, error, progressing, children }) => {
    const classes = useStyles()

    return (
        <>
            <LinearProgress
                style={{
                    // Use `visibility` to make sure that the progress bar keep the same height
                    visibility: progressing ? "visible" : "hidden",
                }}
            />
            <Container component="main" maxWidth="xs" data-testid="auth_container">
                <Typography component="h1" variant="h5" className={classes.title}>
                    {title}
                </Typography>

                {error ? (
                    <Typography color="error" variant="body1" data-testid="auth_error">
                        {error}
                    </Typography>
                ) : null}

                {children}
            </Container>
        </>
    )
}

export default AuthLayout
