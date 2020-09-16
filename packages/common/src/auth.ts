import * as cookies from "./cookie"
import { getCurrentHostName } from "./host"

const COOKIE_KEY = "__rino_sign_in_state_cookie"
const LOCAL_STORAGE_KEY = "__rino_dev_auth_state"

export function setSignInState(signedIn: boolean): void {
    cookies.setCookie(COOKIE_KEY, signedIn ? "yes" : "no", {
        domain: getCurrentHostName(),
    })
    window.localStorage.setItem(LOCAL_STORAGE_KEY, signedIn ? "yes" : "no")
}

export function getSignInState(): boolean {
    const cookieValue: boolean = cookies.getCookie(COOKIE_KEY) === "yes"
    const storageValue: boolean = window.localStorage.getItem(LOCAL_STORAGE_KEY) == "yes"

    if (cookieValue && storageValue) {
        return true
    } else if (cookieValue || storageValue) {
        setSignInState(true)
        return true
    } else {
        return false
    }
}
