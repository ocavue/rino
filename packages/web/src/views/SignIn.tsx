import { Grid, Link } from "@material-ui/core"
import { FirebaseError } from "firebase"
import { useRouter } from "next/router"
import React, { useMemo, useState } from "react"

import {
    AuthContainer,
    AuthForm,
    PasswordTextField,
    SubmitButton,
    UsernameTextField,
} from "src/components/Auth"
import { signInWithEmailAndPassword } from "src/controller"

export default function SignIn() {
    const router = useRouter()
    const [sending, setSending] = useState(false)
    const [error, setError] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const disableSubmit = useMemo(() => !email || !password || sending, [email, password, sending])
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        setSending(true)
        setError("")
        signInWithEmailAndPassword(email, password)
            .then(() => {
                return router.push("/")
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

    return (
        <AuthContainer title="Sign in to Rino" error={error} progressing={sending}>
            <AuthForm onSubmit={handleSubmit} data-testid="auth_signin_form">
                <UsernameTextField
                    disabled={sending}
                    onChange={(e) => setEmail(e.target.value)}
                    inputProps={{ "data-testid": "auth_signin_username_textfield" }}
                />
                <PasswordTextField
                    disabled={sending}
                    onChange={(e) => setPassword(e.target.value)}
                    inputProps={{ "data-testid": "auth_signin_password_textfield" }}
                />

                <SubmitButton disabled={disableSubmit} data-testid="auth_signin_submit">
                    Sign In
                </SubmitButton>
                <Grid container>
                    <Grid item xs>
                        <Link href="/password-reset" variant="body2">
                            Forgot password?
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link href="/sign-up" variant="body2">
                            Sign up for Rino
                        </Link>
                    </Grid>
                </Grid>
            </AuthForm>
        </AuthContainer>
    )
}
