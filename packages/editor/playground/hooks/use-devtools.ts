import { useEffect, useState } from "react"

import { getURLParam, setURLParam } from "../utils/update-url"

function getURLDevTools(): boolean {
    return getURLParam("enableDevTools", "false") === "true"
}

function setURLDevTools(enable: boolean): void {
    return setURLParam("enableDevTools", enable ? "true" : "false")
}

function useDevToolsEffect(enableDevTools: boolean) {
    useEffect(() => {
        setURLDevTools(enableDevTools)
    }, [enableDevTools])
}

export default function useDevTools() {
    const [enableDevTools, setEnableDevTools] = useState(getURLDevTools)

    useDevToolsEffect(enableDevTools)

    return {
        enableDevTools,
        setEnableDevTools,
    }
}
