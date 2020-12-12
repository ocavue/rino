import { getCookie, setCookie } from "./cookie"
import { getCurrentHostName } from "./host"

const COOKIE_KEY = "__rino_sign_in_state_cookie"
const LOCAL_STORAGE_KEY = "__rino_dev_auth_state"

export function setSignInState(signedIn: boolean): void {
    const value = signedIn ? "yes" : "no"
    const domain = "." + getCurrentHostName()
    setCookie(COOKIE_KEY, value, { domain, days: 3650 })
    window.localStorage.setItem(LOCAL_STORAGE_KEY, value)
}

export function getSignInState(): boolean {
    if (typeof window === "undefined") {
        return false // For SSR mode
    }

    const cookieFlag: boolean = getCookie(COOKIE_KEY) === "yes"
    const storageFlag: boolean = window.localStorage.getItem(LOCAL_STORAGE_KEY) == "yes"
    return cookieFlag || storageFlag
}
