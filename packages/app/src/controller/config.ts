import * as firebaseJson from "../../../../config/firebase.json"
import * as envJson from "../../../../config/env.json"

let firebaseConfig: {
    apiKey: string
    authDomain: string
    databaseURL: string
    projectId: string
    storageBucket: string
    messagingSenderId: string
    appId: string
} = firebaseJson

interface DevEnv {
    TESTING: true
    TEST_USERNAME: string
    TEST_PASSWORD: string
}

interface ProdEnv {
    TESTING: false
}

let env: DevEnv | ProdEnv = envJson

export { firebaseConfig, env }
