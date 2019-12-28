import { firebase } from "./firebase"
import { generateRandomId } from "@/utils"

async function closurePromiseWrapper<T>(closurePromise: Promise<T>): Promise<T> {
    // `firebase.auth` use Closure library's Promise implementation, so that I can only
    // use `.catch()` instead of `try...catch` to avoid uncaught error.
    // See also https://github.com/firebase/firebase-js-sdk/issues/1881#issuecomment-501886866

    return new Promise(function(resolve, reject) {
        closurePromise.then(result => resolve(result)).catch(error => reject(error))
    })
}

export async function sendSignInLink(email: string): Promise<void> {
    const host =
        process.env.NODE_ENV === "production" ? "https://rino.app" : "http://localhost:8080"
    const url = `${host}/finish-sign-up/${generateRandomId()}`

    return await closurePromiseWrapper(
        firebase.auth().sendSignInLinkToEmail(email, { url, handleCodeInApp: true }),
    )
}

export async function signInWithEmailAndPassword(email: string, password: string) {
    return await closurePromiseWrapper(firebase.auth().signInWithEmailAndPassword(email, password))
}

export async function signOut() {
    await closurePromiseWrapper(firebase.auth().signOut())
}

export function onAuthStateChanged(next: (user: firebase.User | null) => void) {
    firebase.auth().onAuthStateChanged(function(user) {
        next(user)
    })
}

export function getCurrentUser() {
    return firebase.auth().currentUser
}
