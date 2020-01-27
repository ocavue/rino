import { Theme, useMediaQuery } from "@material-ui/core"
import { useCallback } from "react"

export function useIsMobile(): boolean {
    return useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"))
}

// export function callbackDeco<P extends Array<any>, R>(callback: (...params: P) => R) {
//     return useCallback((...p) => callback(...p), [callback])
// }
