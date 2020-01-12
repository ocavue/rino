import { Theme, useMediaQuery } from "@material-ui/core"
import React from "react"

export function useAsyncEffect<T>(fn: () => Promise<T>) {
    return React.useEffect(() => {
        fn()
    })
}

export function useMountEffect(fn: () => void) {
    return React.useEffect(fn, [])
}

export function useForceUpdate() {
    const [, setBool] = React.useState(false)
    return () => setBool(bool => !bool)
}

export function useIsMobile(): boolean {
    return useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"))
}
