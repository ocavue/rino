/* Copyright (c) 2019-present ocavue@gmail.com */

// Firebase App (the core Firebase SDK) is always required and must be listed first
// Add the Firebase products that you want to use
import "firebase/auth"
import "firebase/database"
import "firebase/firestore"

import firebase from "firebase/app"

import { isTestEnv } from "src/utils"

import { firebaseConfig } from "../config"

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

    app.firestore()
        .enablePersistence({ synchronizeTabs: true })
        .catch((error: firebase.functions.HttpsError) => {
            if (error?.code === "failed-precondition") {
                console.warn("failed-precondition")
                // Multiple tabs open, persistence can only be enabled
                // in one tab at a a time.
                // ...

                // TODO: add notice for users (like what Gmail does)
            } else if (error?.code === "unimplemented") {
                // The current browser does not support all of the
                // features required to enable persistence
                // ...

                // When running unit tests, since JSDOM doesn't support `LocalStorage`, firebase cann't enable persistence.
                if (process.env.NODE_ENV !== "test") {
                    console.error(error)
                }
            } else {
                console.error(error)
            }
        })

    return app
})()

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
