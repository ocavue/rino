import { useRouter } from "next/router"
import React from "react"

import { signInTestUser } from "src/controller"
import Alert from "src/views/Alert"

export default function DevSignIn() {
    const router = useRouter()
    const query = new URLSearchParams(window.location.search)
    React.useEffect(() => {
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
    }, [router, query])
    return <Alert title="sign in" message="development" />
}
