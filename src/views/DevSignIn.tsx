import { signInTestUser } from "src/controller"
import { useRouter } from "next/router"
import React from "react"

export default function DevSignIn() {
    const router = useRouter()
    const query = new URLSearchParams(window.location.search)
    React.useEffect(() => {
        const effect = async () => {
            await signInTestUser()
            const redirect = query.get("redirect") || "/"
            setTimeout(() => {
                router.push(redirect)
            }, 500)
        }
        const timeout = setTimeout(() => {
            effect()
        }, 2000)
        return () => clearTimeout(timeout)
    }, [router, query])
    return <div>dev sign in</div>
}
