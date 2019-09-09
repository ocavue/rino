import { firebase } from "./firebase"
import { generateRandomId } from "@/utils"

export async function sendSignInLink(email: string) {
    const host =
        process.env.NODE_ENV === "production" ? "https://rino.app" : "http://localhost:8080"
    const url = `${host}/finish-sign-up/${generateRandomId()}`
    return await firebase.auth().sendSignInLinkToEmail(email, { url, handleCodeInApp: true })
}

export async function signInWithEmailAndPassword(email: string, password: string) {
    return await firebase.auth().signInWithEmailAndPassword(email, password)
}
