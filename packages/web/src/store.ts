import { useMemo, useState } from "react"
import { createContainer } from "unstated-next"

import { theme } from "src/controller"

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

    return {
        drawerActivity,
        setDrawerActivity,
        isDarkTheme,
        toggleTheme,
    }
}

const useStore = () => {
    return {
        state: { ...useUiState(), ...useNetworkState() },
    }
}

export const StoreContainer = createContainer(useStore)
