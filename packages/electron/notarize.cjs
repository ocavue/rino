const { notarize } = require("electron-notarize")

function log(...args) {
    const date = new Date().toISOString()
    // Match the log format of the electron-builder
    console.log(`  • notarize.cjs    ${date}`, ...args)
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
    if (electronPlatformName !== "darwin") {
        log("skip notarizing on non-darwin platform")
        return
    }

    log("appOutDir:", appOutDir)

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
