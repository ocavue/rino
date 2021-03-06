import dynamic from "next/dynamic"
import React, { useState } from "react"

import AuthLayout from "src/components/auth/AuthLayout"

const SignInForm = dynamic(() => import("../components/auth/SignInForm"), { ssr: false })

export default function SignIn() {
    const [progressing, setProgressing] = useState(false)
    const [error, setError] = useState("")

    return (
        <AuthLayout title="Sign in to Rino" error={error} progressing={progressing}>
            <SignInForm progressing={progressing} setProgressing={setProgressing} setError={setError} />
        </AuthLayout>
    )
}
