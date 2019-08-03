import { firebase } from "./firebase"
import { generateRandomId } from "../utils"

export async function sendSignInLink(email: string) {
    const url = `http://localhost:1234/finish-sign-up/${generateRandomId()}`
    return await firebase.auth().sendSignInLinkToEmail(email, { url, handleCodeInApp: true })
}

export async function signInWithEmailAndPassword(email: string, password: string) {
    return await firebase.auth().signInWithEmailAndPassword(email, password)
}
