import { useState } from "react"
import { createContainer } from "unstated-next"

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

    return {
        drawerActivity,
        setDrawerActivity,
    }
}

const useStore = () => {
    return {
        state: { ...useUiState(), ...useNetworkState() },
    }
}

export const StoreContainer = createContainer(useStore)
