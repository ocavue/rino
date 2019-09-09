import firebaseJson from "../../config/firebase.json"

let firebaseConfig: {
    apiKey: string
    authDomain: string
    databaseURL: string
    projectId: string
    storageBucket: string
    messagingSenderId: string
    appId: string
} = firebaseJson

let testUser = {
    username: process.env.VUE_APP_TEST_USERNAME || "",
    password: process.env.VUE_APP_TEST_PASSWORD || "",
}

export { firebaseConfig, testUser }
