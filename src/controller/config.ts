import firebaseJson from "../../config/firebase.json"

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
    username: process.env.VUE_APP_TEST_USERNAME || "",
    password: process.env.VUE_APP_TEST_PASSWORD || "",
}

const version = `${process.env.VUE_APP_VERSION} (${process.env.VUE_APP_COMMIT})`

export { firebaseConfig, testUser, version }
