const path = require("path")
const fs = require("fs")
const admin = require("firebase-admin")
const HttpsProxyAgent = require("https-proxy-agent")
const firebaseConfig = require("../config/firebase.client.json")

function initializeApp() {
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(
            __dirname,
            "..",
            "config",
            "firebase.admin.json",
        )
    }
    console.log(`GOOGLE_APPLICATION_CREDENTIALS: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`)
    const HTTP_PROXY = process.env.HTTP_PROXY || process.env.http_proxy
    console.log(`HTTP_PROXY: ${HTTP_PROXY}`)

    const agent = HTTP_PROXY ? new HttpsProxyAgent(HTTP_PROXY) : undefined
    admin.initializeApp({
        credential: admin.credential.applicationDefault(agent),
        databaseURL: firebaseConfig.databaseURL,
        httpAgent: agent,
    })
}

async function readData() {
    // As an admin, the app has access to read and write all data, regardless of Security Rules
    const db = admin.firestore()
    const collection = db.collection("notes")
    const query = await collection.get()
    const jsonDocs = query.docs.map(snapshot => {
        return JSON.parse(JSON.stringify(snapshot.data()))
    })
    const outputPath = path.resolve("./output.json")
    fs.writeFileSync(outputPath, JSON.stringify(jsonDocs), "utf-8")
    console.log(`Save to ${outputPath}`)
}

async function main() {
    initializeApp()
    await readData()
}

main()
