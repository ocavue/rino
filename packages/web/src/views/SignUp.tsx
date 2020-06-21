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
import { createUserWithEmailAndPassword } from "src/controller"

export default function SignUp() {
    const router = useRouter()
    const [sending, setSending] = useState(false)
    const [error, setError] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const disableSubmit = useMemo(() => !email || !password || sending, [email, password, sending])
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        setSending(true)
        setError("")
        createUserWithEmailAndPassword(email, password)
            .then(() => {
                return router.push("/")
            })
            .catch((error: FirebaseError) => {
                console.error(error)
                setError(String(error))
                setSending(false)
            })
        event.preventDefault()
    }

    return (
        <AuthContainer title="Sign up to Rino" error={error} progressing={sending}>
            <AuthForm onSubmit={handleSubmit} data-testid="auth_signup_form">
                <UsernameTextField
                    disabled={sending}
                    onChange={(e) => setEmail(e.target.value)}
                    inputProps={{ "data-testid": "auth_signup_username_textfield" }}
                />
                <PasswordTextField
                    disabled={sending}
                    onChange={(e) => setPassword(e.target.value)}
                    inputProps={{ "data-testid": "auth_signup_password_textfield" }}
                />

                <SubmitButton disabled={disableSubmit} data-testid="auth_signup_submit">
                    Sign Up
                </SubmitButton>
                <Grid container>
                    <Grid item xs></Grid>
                    <Grid item>
                        <Link href="#" variant="body2">
                            Already have an account? Sign in
                        </Link>
                    </Grid>
                </Grid>
            </AuthForm>
        </AuthContainer>
    )
}
