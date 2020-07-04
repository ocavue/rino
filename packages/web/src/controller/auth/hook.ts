import { useEffect, useMemo, useState } from "react"
import { createContainer } from "unstated-next"

import { User } from "src/controller/firebase/firebase-types"

import { getCurrentUser, onAuthStateChanged } from "./actions"

function useAuth() {
    const [user, setUser] = useState<User | null>(getCurrentUser())
    const email: string | null = useMemo(() => (user ? user.email : null), [user])
    const [loadingUser, setLoadingUser] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged((user) => {
            const currentUser = getCurrentUser()
            if (currentUser?.uid !== user?.uid) {
                console.warn(
                    `getCurrentUser return ${currentUser} but onAuthStateChanged call ${user}`,
                )
            }
            setUser(user)
            setLoadingUser(false)
            window.localStorage.setItem("__rino_dev_auth_state", user ? "yes" : "no")
        })
        return () => unsubscribe()
    }, [setLoadingUser, setUser])

    return { user, setUser, email, loadingUser, setLoadingUser }
}

export const AuthContainer = createContainer(useAuth)
