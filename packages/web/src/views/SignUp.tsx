import dynamic from "next/dynamic"
import React, { useState } from "react"

import { AuthLayout } from "src/components/Auth/Auth"
import { AuthContainer } from "src/controller/auth/hook"

const SignUpForm = dynamic(() => import("../components/Auth/SignUpForm"), { ssr: false })

export default function SignUp() {
    const [progressing, setProgressing] = useState(false)
    const [error, setError] = useState("")

    return (
        <AuthContainer.Provider>
            <AuthLayout title="Sign up to Rino" error={error} progressing={progressing}>
                <SignUpForm
                    progressing={progressing}
                    setProgressing={setProgressing}
                    setError={setError}
                />
            </AuthLayout>
        </AuthContainer.Provider>
    )
}
