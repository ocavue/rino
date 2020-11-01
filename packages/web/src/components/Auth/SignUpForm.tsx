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
import { createUserWithEmailAndPassword } from "src/controller/auth/actions"
import { AuthContainer } from "src/controller/auth/hook"

type SignUpFormProps = {
    progressing: boolean
    setProgressing: (val: boolean) => void
    setError: (val: string) => void
}

export default function SignUpForm({ progressing, setProgressing, setError }: SignUpFormProps) {
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
        createUserWithEmailAndPassword(email, password)
            .then(() => {
                return router.push("/")
            })
            .catch((error: firebase.FirebaseError) => {
                console.error(error)
                setError(String(error))
                setProgressing(false)
            })
        event.preventDefault()
    }

    return (
        <AuthContainer.Provider>
            <AuthForm onSubmit={handleSubmit} data-testid="auth_signup_form">
                <UsernameTextField
                    disabled={progressing}
                    onChange={(e) => setEmail(e.target.value)}
                    inputProps={{ "data-testid": "auth_signup_username_textfield" }}
                />
                <PasswordTextField
                    disabled={progressing}
                    onChange={(e) => setPassword(e.target.value)}
                    inputProps={{ "data-testid": "auth_signup_password_textfield" }}
                />

                <SubmitButton disabled={disableSubmit} data-testid="auth_signup_submit">
                    Sign Up
                </SubmitButton>
                <Grid container>
                    <Grid item xs></Grid>
                    <Grid item>
                        <Link href="/sign-in" variant="body2">
                            Already have an account? Sign in
                        </Link>
                    </Grid>
                </Grid>
            </AuthForm>
        </AuthContainer.Provider>
    )
}
