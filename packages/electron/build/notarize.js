const { notarize } = require("electron-notarize")

function log(...args) {
    const date = new Date().toISOString()
    console.log("[notarize.js]", date, ...args)
}

function loadEnv(name) {
    const value = process.env[name]
    if (!value) {
        log(`unable to find environment variable '${name}'`)
    }
    return value
}

async function notarizing(context) {
    log("running")

    const { electronPlatformName, appOutDir } = context

    log("electronPlatformName:", electronPlatformName)
    log("appOutDir:", appOutDir)

    if (electronPlatformName !== "darwin") {
        return
    }

    const appName = context.packager.appInfo.productFilename
    log("appName:", appName)

    const result = await notarize({
        appBundleId: "app.rino.www",
        appPath: `${appOutDir}/${appName}.app`,
        appleId: loadEnv("ELECTRON_APPLE_ID"),
        appleIdPassword: loadEnv("ELECTRON_APPLE_ID_PASSWORD"),
    })

    log(`done`)

    return result
}

exports.default = notarizing
