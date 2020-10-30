import { getSignInState, getWebAppHostName } from "@rino.app/common"
import { useEffect, useMemo, useState } from "react"

type AuthInfo =
    | {
          isSSR: true
          signInLink: ""
          signUpLink: ""
          appLink: ""
          isSignedIn: null
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
                signInLink: "",
                signUpLink: "",
                appLink: "",
                isSignedIn: null,
            } as const
        } else {
            const host = getWebAppHostName()
            return {
                isSSR: false,
                signInLink: `${host}/sign-in`,
                signUpLink: `${host}/sign-up`,
                appLink: host,
                isSignedIn,
            } as const
        }
    }, [isSignedIn])
}
