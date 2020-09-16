import * as cookies from "./cookies"

const COOKIE_KEY = "__rino_sign_in_state"

export function setSignInState(signedIn: boolean): void {
    cookies.setCookie(COOKIE_KEY, signedIn ? "yes" : "no")
}

export function getSignInState(): boolean {
    return cookies.getCookie(COOKIE_KEY) === "yes"
}
