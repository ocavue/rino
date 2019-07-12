import * as firebaseJson from "../../../../config/firebase.json"

let firebaseConfig: {
    apiKey: string
    authDomain: string
    databaseURL: string
    projectId: string
    storageBucket: string
    messagingSenderId: string
    appId: string
} = firebaseJson

export { firebaseConfig }
