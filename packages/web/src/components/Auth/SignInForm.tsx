import { Grid, Link } from "@material-ui/core"
import firebase from "firebase"
import { useRouter } from "next/router"
import React, { useMemo, useState } from "react"

import {
    AuthForm,
    PasswordTextField,
    SubmitButton,
    UsernameTextField,
} from "src/components/Auth/Auth"
import { signInWithEmailAndPassword } from "src/controller/auth/actions"
import { AuthContainer } from "src/controller/auth/hook"

type SignInFormProps = {
    progressing: boolean
    setProgressing: (val: boolean) => void
    setError: (val: string) => void
}

export default function SignInForm({ progressing, setProgressing, setError }: SignInFormProps) {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const disableSubmit = useMemo(() => !email || !password || progressing, [
        email,
        password,
        progressing,
    ])
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        setProgressing(true)
        setError("")
        signInWithEmailAndPassword(email, password)
            .then(() => {
                return router.push("/")
            })
            .catch((error: firebase.FirebaseError) => {
                console.error(error)

                if (error?.code === "auth/user-not-found") {
                    setError("Couldn't find your Rino account")
                } else {
                    setError(String(error))
                }
                setProgressing(false)
            })
        event.preventDefault()
    }

    return (
        <AuthContainer.Provider>
            <AuthForm onSubmit={handleSubmit} data-testid="auth_signin_form">
                <UsernameTextField
                    disabled={progressing}
                    onChange={(e) => setEmail(e.target.value)}
                    inputProps={{ "data-testid": "auth_signin_username_textfield" }}
                />
                <PasswordTextField
                    disabled={progressing}
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
        </AuthContainer.Provider>
    )
}
