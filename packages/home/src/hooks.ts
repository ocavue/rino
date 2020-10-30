import { getSignInState, getWebAppHostName } from "@rino.app/common"
import { useEffect, useMemo, useState } from "react"

type AuthInfo =
    | {
          isSSR: true
      }
    | {
          isSSR: false
          signInLink: string
          signUpLink: string
          appLink: string
          isSignedIn: boolean
      }

export function useAuthInfo(): AuthInfo {
    const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null)

    useEffect(() => {
        setIsSignedIn(getSignInState())
    }, [])

    return useMemo(() => {
        if (isSignedIn === null) {
            return {
                isSSR: true,
            } as const
        } else {
            const host = getWebAppHostName()
            return {
                signInLink: `${host}/sign-in`,
                signUpLink: `${host}/sign-up`,
                appLink: host,
                isSignedIn,
                isSSR: false,
            } as const
        }
    }, [isSignedIn])
}
