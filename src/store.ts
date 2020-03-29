import { useMemo, useState } from "react"
import { createContainer } from "unstated-next"

import { getCurrentUser, theme, User } from "src/controller"

const useAuth = () => {
    const [user, setUser] = useState<User | null>(getCurrentUser())
    const email: string | null = useMemo(() => user?.email || null, [user])
    return { user, email, setUser }
}

const useTheme = () => {
    const [isDarkTheme, setDarkTheme] = useState(theme.getTheme() === "dark")
    const toggleTheme = () => {
        const newAppTheme = isDarkTheme ? "light" : "dark"
        theme.setTheme(newAppTheme)
        setDarkTheme(!isDarkTheme)
    }
    return { isDarkTheme, toggleTheme }
}

const useLoading = () => {
    const [loadingUser, setLoadingUser] = useState(true)
    const [loadingData, setLoadingData] = useState(true)
    const loading = useMemo(() => loadingUser || loadingData, [loadingData, loadingUser])

    return {
        loadingUser,
        setLoadingUser,
        loadingData,
        setLoadingData,
        loading,
    }
}

const useNetworkState = () => {
    const [connected, setConnected] = useState(false)
    const loadingState = useLoading()
    return {
        setConnected,
        connected,
        ...loadingState,
    }
}

const useUiState = () => {
    const [drawerActivity, setDrawerActivity] = useState(true)

    const { isDarkTheme, toggleTheme } = useTheme()
    const [debug, setDebug] = useState(0)
    const updateDebug = () => setDebug((n) => n + 1)

    return {
        drawerActivity,
        setDrawerActivity,
        isDarkTheme,
        toggleTheme,
        debug,
        updateDebug,
    }
}

const useStore = () => {
    return {
        auth: useAuth(),
        state: { ...useUiState(), ...useNetworkState() },
    }
}

export const StoreContainer = createContainer(useStore)
