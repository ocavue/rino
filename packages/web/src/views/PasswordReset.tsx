import { Grid, Link, Typography } from "@material-ui/core"
import { FirebaseError } from "firebase"
import React, { useMemo, useState } from "react"

import { AuthContainer, AuthForm, SubmitButton, UsernameTextField } from "src/components/Auth"
import { sendPasswordResetEmail } from "src/controller"

export default function PasswordReset() {
    const [sending, setSending] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState("")
    const [email, setEmail] = useState("")
    const disableSubmit = useMemo(() => !email || sending, [email, sending])
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        setSending(true)
        setError("")
        sendPasswordResetEmail(email)
            .then(() => {
                setSent(true)
                setSending(false)
            })
            .catch((error: FirebaseError) => {
                console.error(error)

                if (error?.code === "auth/user-not-found") {
                    setError("Couldn't find your Rino account")
                } else {
                    setError(String(error))
                }
                setSending(false)
            })
        event.preventDefault()
    }

    if (!sent) {
        return (
            <AuthContainer title="Reset your password" error={error} progressing={sending}>
                <AuthForm onSubmit={handleSubmit} data-testid="auth_password_reset_form">
                    <UsernameTextField
                        disabled={sending}
                        onChange={(e) => setEmail(e.target.value)}
                        inputProps={{ "data-testid": "auth_password_reset_username_textfield" }}
                    />
                    <SubmitButton disabled={disableSubmit} data-testid="auth_password_reset_submit">
                        Next
                    </SubmitButton>
                </AuthForm>
            </AuthContainer>
        )
    } else {
        return (
            <AuthContainer title="Check your email" error="" progressing={false}>
                <Typography variant="body1" data-testid="auth_password_reset_result">
                    We've sent an email to <strong>{email}</strong>. Click the link in the email to
                    reset your password.
                </Typography>
                <Grid container>
                    <Grid item>
                        <Link href="/sign-up" variant="body2">
                            Sign in for Rino
                        </Link>
                    </Grid>
                </Grid>
            </AuthContainer>
        )
    }
}
