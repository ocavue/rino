// Firebase App (the core Firebase SDK) is always required and must be listed first
// Add the Firebase products that you want to use
import "firebase/auth"
import "firebase/database"
import "firebase/firestore"

import firebase from "firebase/app"

import { isTestEnv } from "src/utils"

import { firebaseConfig } from "./config"

export const firebaseApp: firebase.app.App = (() => {
    // Avoid duplicate initiations during development
    if (firebase.apps.length) {
        return firebase.apps[0]
    }

    // Initialize app
    const app = firebase.initializeApp(firebaseConfig)

    const usingEmulator = isTestEnv() && process.env.FIRESTORE_EMULATOR_HOST
    usingEmulator
        ? app.firestore().settings({
              // Configure cache size (The default size is 40 MB)
              cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
              host: process.env.FIRESTORE_EMULATOR_HOST,
              ssl: false,
          })
        : app.firestore().settings({
              cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
          })

    // Enable offline firestore.
    // When running unit tests, since JSDOM doesn't support `LocalStorage`, firebase cann't enable persistence.
    if (process.env.NODE_ENV !== "test") {
        app.firestore()
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

    return app
})()

export type DocumentReference = firebase.firestore.DocumentReference
export type DocumentSnapshot = firebase.firestore.DocumentSnapshot
export type User = firebase.User
export type Timestamp = firebase.firestore.Timestamp
export const Timestamp = firebase.firestore.Timestamp

export function registerConnectionEvent(listenner: (connected: boolean) => void) {
    const onConnectedChanged = (snap: firebase.database.DataSnapshot) => {
        const connected = snap.val() === true
        console.log(`Firebase is ${connected ? "online" : "offline"}`)
        listenner(connected)
    }
    const ref = firebaseApp.database().ref(".info/connected")
    ref.on("value", onConnectedChanged)
    const unsubscribe = () => ref.off("value")
    return unsubscribe
}

export const notesCollection = firebaseApp.firestore().collection("notes")
