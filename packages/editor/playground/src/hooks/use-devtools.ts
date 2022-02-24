import { useCallback, useState } from "react"

import updateURLParams from "../utils/update-url"

export default function useDevTools(initEnableDevTools: boolean) {
    const [enableDevTools, setEnableDevTools] = useState(initEnableDevTools)
    return {
        enableDevTools,
        setEnableDevTools: useCallback((newEnable: boolean) => {
            setEnableDevTools(newEnable)
            updateURLParams({ enableDevTools: newEnable })
        }, []),
    }
}
