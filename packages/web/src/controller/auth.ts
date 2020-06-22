import { testUser } from "src/controller/config"

import { firebaseApp, User } from "./firebase"

async function closurePromiseWrapper<T>(closurePromise: Promise<T>): Promise<T> {
    // `firebase.auth` use Closure library's Promise implementation, so that I can only
    // use `.catch()` instead of `try...catch` to avoid uncaught error.
    // See also https://github.com/firebase/firebase-js-sdk/issues/1881#issuecomment-501886866

    return new Promise(function (resolve, reject) {
        closurePromise.then((result) => resolve(result)).catch((error) => reject(error))
    })
}

export async function signInWithEmailAndPassword(email: string, password: string) {
    return await closurePromiseWrapper(
        firebaseApp.auth().signInWithEmailAndPassword(email, password),
    )
}

export async function signInTestUser() {
    console.debug(`Sign in with '${testUser.username}' '${testUser.password}'`)
    return await signInWithEmailAndPassword(testUser.username, testUser.password)
}

export async function signOut() {
    await closurePromiseWrapper(firebaseApp.auth().signOut())
}

export function onAuthStateChanged(next: (user: User | null) => void) {
    const unsubscribe = firebaseApp.auth().onAuthStateChanged(next)
    return unsubscribe
}

export function getCurrentUser() {
    return firebaseApp.auth().currentUser
}

export async function createUserWithEmailAndPassword(email: string, password: string) {
    return await closurePromiseWrapper(
        firebaseApp.auth().createUserWithEmailAndPassword(email, password),
    )
}

export async function sendPasswordResetEmail(email: string) {
    return await closurePromiseWrapper(firebaseApp.auth().sendPasswordResetEmail(email))
}
