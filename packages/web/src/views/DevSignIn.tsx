import { useRouter } from "next/router"
import React from "react"

import { signInTestUser } from "src/controller/auth/actions"
import { AuthContainer } from "src/controller/auth/hook"
import Alert from "src/views/Alert"

function DevSignInConsumer() {
    const router = useRouter()
    React.useEffect(() => {
        const query = new URLSearchParams(window.location.search)
        const effect = async () => {
            await signInTestUser()
            const redirect = query.get("redirect") || "/"
            setTimeout(() => {
                void router.push(redirect)
            }, 500)
        }
        const timeout = setTimeout(() => {
            void effect()
        }, 2000)
        return () => clearTimeout(timeout)
    }, [router])
    return <Alert title="sign in" message="development" />
}

export default function DevSignIn() {
    return (
        <AuthContainer.Provider>
            <DevSignInConsumer />
        </AuthContainer.Provider>
    )
}
