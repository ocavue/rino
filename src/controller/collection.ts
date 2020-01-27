import { firebase } from "./firebase"

export const notesCollection = firebase.firestore().collection("notes")
