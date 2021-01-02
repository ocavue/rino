import dynamic from "next/dynamic"
import React, { useState } from "react"

import AuthLayout from "src/components/auth/AuthLayout"

const SignUpForm = dynamic(() => import("../components/auth/SignUpForm"), { ssr: false })

export default function SignUp() {
    const [progressing, setProgressing] = useState(false)
    const [error, setError] = useState("")

    return (
        <AuthLayout title="Sign up to Rino" error={error} progressing={progressing}>
            <SignUpForm progressing={progressing} setProgressing={setProgressing} setError={setError} />
        </AuthLayout>
    )
}
