import { useMemo, useState } from "react"
import { createContainer } from "unstated-next"

import { User } from "src/controller/firebase/firebase-types"

import { getCurrentUser } from "./actions"

function useAuth() {
    const [user, setUser] = useState<User | null>(getCurrentUser())
    const email: string | null = useMemo(() => (user ? user.email : null), [user])
    const [loadingUser, setLoadingUser] = useState(true)
    return { user, setUser, email, loadingUser, setLoadingUser }
}

export const AuthContainer = createContainer(useAuth)
