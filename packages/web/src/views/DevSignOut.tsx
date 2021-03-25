/* Copyright (c) 2020-present ocavue@gmail.com */

import { useRouter } from "next/router"
import React from "react"

import { signOut } from "src/controller/auth/actions"
import { AuthContainer } from "src/controller/auth/hook"
import Alert from "src/views/Alert"

function DevSignOutConsumer() {
    const router = useRouter()

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            console.log(`running timeout function ${timeout}: before sign-out`)
            void signOut().then(() => {
                console.log(`running timeout function ${timeout}: after sign-out`)
                setTimeout(() => {
                    console.log("before router.push()")
                    void router.push("/")
                    console.log("after router.push()")
                }, 500)
            })
        }, 1000)
        console.log(`created timeout ${timeout}`)
        const unsubscribe = () => {
            console.log(`clearing timeout ${timeout}`)
            clearTimeout(timeout)
        }
        return unsubscribe
    }, [router])
    return <Alert title="sign out" message="development" />
}

export default function DevSignOut() {
    return (
        <AuthContainer.Provider>
            <DevSignOutConsumer />
        </AuthContainer.Provider>
    )
}
