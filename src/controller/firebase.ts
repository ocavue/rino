// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app"
// Add the Firebase products that you want to use
import "firebase/auth"
import "firebase/database"
import "firebase/firestore"

import { firebaseConfig } from "./config"
import { isTestEnv } from "src/utils"

// Avoid duplicate initiations during development
if (firebase.apps.length === 0) {
    // Initialize app
    firebase.initializeApp(firebaseConfig)

    let firestoreSettings: firebase.firestore.Settings = {
        // Configure cache size (The default size is 40 MB)
        cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
    }
    if (isTestEnv() && process.env.FIRESTORE_EMULATOR_HOST) {
        // Use local firebase emulator when running in localhost
        firestoreSettings = {
            ...firestoreSettings,
            host: process.env.FIRESTORE_EMULATOR_HOST,
            ssl: false,
        }
    }
    firebase.firestore().settings(firestoreSettings)

    // Enable offline firestore
    firebase
        .firestore()
        .enablePersistence({ synchronizeTabs: true })
        .catch((error) => {
            console.error(error)
            if (error.code === "failed-precondition") {
                // Multiple tabs open, persistence can only be enabled
                // in one tab at a a time.
                // ...
            } else if (error.code === "unimplemented") {
                // The current browser does not support all of the
                // features required to enable persistence
                // ...
            }
        })
}

export { firebase }
export type DocumentReference = firebase.firestore.DocumentReference
export type DocumentSnapshot = firebase.firestore.DocumentSnapshot
export type Timestamp = firebase.firestore.Timestamp
export type User = firebase.User

export function registerConnectionEvent(listenner: (connected: boolean) => void) {
    const onConnectedChanged = (snap: firebase.database.DataSnapshot) => {
        const connected = snap.val() === true
        console.log(`Firebase is ${connected ? "online" : "offline"}`)
        listenner(connected)
    }
    const ref = firebase.database().ref(".info/connected")
    ref.on("value", onConnectedChanged)
    const unsubscribe = () => ref.off("value")
    return unsubscribe
}

export const notesCollection = firebase.firestore().collection("notes")
