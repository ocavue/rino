import { useRouter } from "next/router"
import React from "react"

import { signOut } from "src/controller/auth/actions"
import { AuthContainer } from "src/controller/auth/hook"
import { StoreContainer } from "src/store"
import Alert from "src/views/Alert"

export default function DevSignOut() {
    const router = useRouter()
    const {
        state: { loadingData },
    } = StoreContainer.useContainer()
    const { user, loadingUser } = AuthContainer.useContainer()

    React.useEffect(() => {
        if (loadingUser || loadingData) return () => {}
        const timeout = setTimeout(() => {
            console.log(`running timeout function ${timeout}: before sign-out`)
            void signOut().then(() => {
                console.log(`running timeout function ${timeout}: after sign-out`)
                setTimeout(() => {
                    console.log("before router.push()")
                    void router.push("/")
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
    }, [router, loadingData, loadingUser, user])
    return <Alert title="sign out" message="development" />
}
