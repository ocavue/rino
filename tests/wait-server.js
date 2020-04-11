/* eslint-disable @typescript-eslint/no-var-requires */
const { request } = require("gaxios")

const url = "http://localhost:3000"

// prettier-ignore
const colors = {
    red:    "\033[0;31m",
    green:  "\033[0;32m",
    yellow: "\033[0;33m",
    reset:  "\033[0m",
}

function sleep(ms) {
    // eslint-disable-next-line no-undef
    return new Promise((resolve) => setTimeout(resolve, ms))
}

async function waitServer() {
    console.log("")
    for (let i = 1; i <= 120; i++) {
        try {
            await request({ url, timeout: 5000, retry: 1 })
            console.log(colors.green + `${url} is ready` + colors.reset)
            return
        } catch (error) {
            console.log(colors.yellow + `${url} is not ready #${i}` + colors.reset)
            await sleep(1000)
        }
    }
    throw Error(`Can't connect to ${url}`)
}

module.exports = waitServer
