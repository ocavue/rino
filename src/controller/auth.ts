import { firebase } from "./firebase"
import { generateRandomId } from "@/utils"

export async function sendSignInLink(email: string): Promise<void> {
    const host =
        process.env.NODE_ENV === "production" ? "https://rino.app" : "http://localhost:8080"
    const url = `${host}/finish-sign-up/${generateRandomId()}`

    // `firebase.auth` use Closure library's Promise implementation, so that I can only
    // use `.catch()` instead of `try...catch` to avoid uncaught error.
    // See also https://github.com/firebase/firebase-js-sdk/issues/1881#issuecomment-501886866
    let error: any = undefined
    await firebase
        .auth()
        .sendSignInLinkToEmail(email, { url, handleCodeInApp: true })
        .catch(e => (error = e))
    if (error) {
        return Promise.reject(error)
    }
}

export async function signInWithEmailAndPassword(email: string, password: string) {
    return await firebase.auth().signInWithEmailAndPassword(email, password)
}
