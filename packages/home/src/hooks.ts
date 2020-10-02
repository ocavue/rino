import { getWebAppHostName } from "@rino.app/common"
import { useMemo } from "react"

export function useAuthLinks() {
    return useMemo(() => {
        const host = getWebAppHostName()
        return {
            signInLink: `${host}/sign-in`,
            signUpLink: `${host}/sign-up`,
            appLink: host,
        }
    }, [])
}
