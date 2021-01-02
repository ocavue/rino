import { Grid, Link, Typography } from "@material-ui/core"
import dynamic from "next/dynamic"
import React, { useState } from "react"

import AuthLayout from "src/components/auth/AuthLayout"

const PasswordResetForm = dynamic(() => import("../components/auth/PasswordResetForm"), {
    ssr: false,
})

export default function PasswordReset() {
    const [progressing, setProgressing] = useState(false)
    const [progressed, setProgressed] = useState(false)
    const [error, setError] = useState("")
    const [email, setEmail] = useState("")

    if (!progressed) {
        return (
            <AuthLayout title="Reset your password" error={error} progressing={progressing}>
                <PasswordResetForm
                    email={email}
                    setEmail={setEmail}
                    progressing={progressing}
                    setProgressing={setProgressing}
                    setProgressed={setProgressed}
                    setError={setError}
                />
            </AuthLayout>
        )
    } else {
        return (
            <AuthLayout title="Check your email" error="" progressing={false}>
                <Typography variant="body1" data-testid="auth_password_reset_result">
                    We've progressed an email to <strong>{email}</strong>. Click the link in the email to reset your password.
                </Typography>
                <Grid container>
                    <Grid item>
                        <Link href="/sign-up" variant="body2">
                            Sign in for Rino
                        </Link>
                    </Grid>
                </Grid>
            </AuthLayout>
        )
    }
}
