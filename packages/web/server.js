const admin = require("firebase-admin")
const functions = require("firebase-functions")
const next = require("next")

admin.initializeApp()

// const dev = process.env.NODE_ENV !== "production"
const app = next({
    dev: false,
    // the absolute directory from the package.json file that initialises this module
    // IE: the absolute path from the root of the Cloud Function
    conf: {
        distDir: ".next/",
    },
})

const handle = app.getRequestHandler()

const server = functions.https.onRequest((request, response) => {
    console.log("[onRequest] File: " + request.originalUrl)

    // https://firebase.google.com/docs/hosting/manage-cache#set_cache-control
    response.set("Cache-Control", "public, max-age=600, s-maxage=86400")

    return app.prepare().then(() => handle(request, response))
})

exports.nextjs = { server }
