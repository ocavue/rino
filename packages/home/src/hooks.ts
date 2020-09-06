import { getWebAppHostName } from "@rino.app/common"
import { useMemo } from "react"

export function useAuthLinks() {
    return useMemo(() => {
        const host = getWebAppHostName({ protocol: true })
        return {
            signInLink: `${host}/sign-in`,
            signUpLink: `${host}/sign-up`,
        }
    }, [])
}
