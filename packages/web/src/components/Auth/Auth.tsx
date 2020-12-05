import {
    Button,
    ButtonProps,
    Container,
    createStyles,
    LinearProgress,
    makeStyles,
    TextField,
    TextFieldProps,
    Theme,
    Typography,
    withStyles,
} from "@material-ui/core"
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
export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, error, progressing, children }) => {
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

type AuthTextFieldProps = Pick<TextFieldProps, "onChange" | "disabled" | "autoFocus" | "inputProps">

export const UsernameTextField: React.FC<AuthTextFieldProps> = (props) => {
    return (
        <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            {...props}
        />
    )
}

export const PasswordTextField: React.FC<AuthTextFieldProps> = (props) => {
    return (
        <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            {...props}
        />
    )
}

const StyledButton = withStyles(
    createStyles({
        root: {
            // By default, Button has "textTransform: uppercase" CSS
            textTransform: "none",
            marginTop: 16,
            marginBottom: 24,
            height: 56,
            fontSize: "1.1rem",
            fontWeight: 500,
        },
    }),
)(Button)
export const SubmitButton: React.FC<ButtonProps> = (props) => (
    <StyledButton type="submit" fullWidth variant="contained" color="primary" size="large" {...props} />
)

type OnSubmit = (event: React.FormEvent<HTMLFormElement>) => void
export const AuthForm: React.FC<{ onSubmit: OnSubmit }> = (props) => {
    return (
        <form
            style={{
                paddingTop: 16,
                width: "100%" /* Fix IE 11 issue. */,
            }}
            noValidate
            {...props}
        ></form>
    )
}
