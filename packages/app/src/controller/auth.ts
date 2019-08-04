import { firebase } from "./firebase"
import { generateRandomId } from "../utils"
import { env } from "./config"

export async function sendSignInLink(email: string) {
    const host = env.TESTING ? "http://localhost:1234" : "https://rino.app"
    const url = `${host}/finish-sign-up/${generateRandomId()}`
    return await firebase.auth().sendSignInLinkToEmail(email, { url, handleCodeInApp: true })
}

export async function signInWithEmailAndPassword(email: string, password: string) {
    return await firebase.auth().signInWithEmailAndPassword(email, password)
}
