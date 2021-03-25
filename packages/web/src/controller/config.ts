/* Copyright (c) 2019-present ocavue@gmail.com */

import firebaseJson from "../../config/firebase.client.json"

const firebaseConfig: {
    apiKey: string
    authDomain: string
    databaseURL: string
    projectId: string
    storageBucket: string
    messagingSenderId: string
    appId: string
} = firebaseJson

const testUser = {
    username: process.env.REACT_APP_TEST_USERNAME || "",
    password: process.env.REACT_APP_TEST_PASSWORD || "",
}

const version = `${process.env.REACT_APP_VERSION} (${process.env.REACT_APP_COMMIT})`

export { firebaseConfig, testUser, version }
