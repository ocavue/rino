import { testUser } from "src/controller/config"
import { generateRandomId } from "src/utils"

import { firebase } from "./firebase"

async function closurePromiseWrapper<T>(closurePromise: Promise<T>): Promise<T> {
    // `firebase.auth` use Closure library's Promise implementation, so that I can only
    // use `.catch()` instead of `try...catch` to avoid uncaught error.
    // See also https://github.com/firebase/firebase-js-sdk/issues/1881#issuecomment-501886866

    return new Promise(function (resolve, reject) {
        closurePromise.then((result) => resolve(result)).catch((error) => reject(error))
    })
}

export async function sendSignInLink(email: string): Promise<void> {
    const host = window.location.protocol + "//" + window.location.host
    const url = `${host}/finish-sign-up?rino-random=${generateRandomId()}`

    return await closurePromiseWrapper(
        firebase.auth().sendSignInLinkToEmail(email, { url, handleCodeInApp: true }),
    )
}

export async function signInWithEmailLink() {
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
        // Additional state parameters can also be passed via URL.
        // This can be used to continue the user's intended action before triggering
        // the sign-in operation.
        // Get the email if available. This should be available if the user completes
        // the flow on the same device where they started it.
        let email = window.localStorage.getItem("emailForSignIn")
        if (!email) {
            // User opened the link on a different device. To prevent session fixation
            // attacks, ask the user to provide the associated email again. For example:
            email = window.prompt("Please provide your email for confirmation") || ""
        }
        // The client SDK will parse the code from the link for you.
        const signInPromise = firebase.auth().signInWithEmailLink(email, window.location.href)
        let result: firebase.auth.UserCredential
        try {
            result = await closurePromiseWrapper(signInPromise)
        } catch (error) {
            // Some error occurred, you can inspect the code: error.code
            // Common errors could be invalid email and invalid or expired OTPs.
            console.error("Failed to sign in:", error)
            throw error
        }
        // Clear email from storage.
        window.localStorage.removeItem("emailForSignIn")
        // You can access the new user via result.user
        // Additional user info profile not available via:
        // result.additionalUserInfo.profile == null
        // You can check if the user is new or existing:
        // result.additionalUserInfo.isNewUser
        return result
    } else {
        throw Error("Wrong email link")
    }
}
export async function signInWithEmailAndPassword(email: string, password: string) {
    return await closurePromiseWrapper(firebase.auth().signInWithEmailAndPassword(email, password))
}

export async function signInTestUser() {
    console.debug(`Sign in with '${testUser.username}' '${testUser.password}'`)
    return await signInWithEmailAndPassword(testUser.username, testUser.password)
}

export async function signOut() {
    await closurePromiseWrapper(firebase.auth().signOut())
}

export function onAuthStateChanged(next: (user: firebase.User | null) => void) {
    const unsubscribe = firebase.auth().onAuthStateChanged(function (user) {
        next(user)
    })
    return unsubscribe
}

export function getCurrentUser() {
    return firebase.auth().currentUser
}
