import { useRouter } from "next/router"
import React from "react"

import { signOut } from "src/controller"
import { StoreContainer } from "src/store"
import Alert from "src/views/Alert"

export default function DevSignOut() {
    const router = useRouter()
    const {
        state: { loadingData, loadingUser, loading },
        auth: { user },
    } = StoreContainer.useContainer()

    React.useEffect(() => {
        console.log(`useEffect:`, { loadingData, loadingUser, loading, user: !!user })
        if (loading) return () => {}
        const timeout = setTimeout(() => {
            console.log(`running timeout function ${timeout}: before sign-out`)
            signOut().then(() => {
                console.log(`running timeout function ${timeout}: after sign-out`)
                setTimeout(() => {
                    console.log("before router.push()")
                    router.push("/")
                    console.log("after router.push()")
                }, 0)
            })
        }, 5000)
        console.log(`created timeout ${timeout}`)
        const unsubscribe = () => {
            console.log(`clearing timeout ${timeout}`)
            clearTimeout(timeout)
        }
        return unsubscribe
    }, [router, loading, loadingData, loadingUser, user])
    return <Alert title="sign out" message="development" />
}
