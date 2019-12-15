// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app"
// Add the Firebase products that you want to use
import "firebase/auth"
import "firebase/firestore"
import "firebase/database"

import { firebaseConfig } from "./config"

// Avoid duplicate initiations during development
if (firebase.apps.length === 0) {
    // Initialize app
    firebase.initializeApp(firebaseConfig)

    // Enable offline firestore
    firebase
        .firestore()
        .enablePersistence({ synchronizeTabs: true })
        .catch(error => {
            console.error(error)
            if (error.code == "failed-precondition") {
                // Multiple tabs open, persistence can only be enabled
                // in one tab at a a time.
                // ...
            } else if (error.code == "unimplemented") {
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
    firebase
        .database()
        .ref(".info/connected")
        .on("value", function(snap) {
            const connected = snap.val() === true
            console.log(`Firebase is ${connected ? "online" : "offline"}`)
            listenner(connected)
        })
}
