import { useState } from "react"
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
    const [loadingData, setLoadingData] = useState(true)

    return {
        loadingData,
        setLoadingData,
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
