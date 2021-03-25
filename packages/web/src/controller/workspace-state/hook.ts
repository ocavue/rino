/* Copyright (c) 2020-present ocavue@gmail.com */

import { useState } from "react"
import { createContainer } from "unstated-next"

const useWorkspaceState = () => {
    const [connected, setConnected] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [drawerActivity, setDrawerActivity] = useState(true)
    return {
        connected,
        setConnected,
        loadingData,
        setLoadingData,
        drawerActivity,
        setDrawerActivity,
    }
}

export const WorksapceStateContainer = createContainer(useWorkspaceState)
