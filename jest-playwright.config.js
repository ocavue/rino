// @ts-check

const launchArgs = [
    // Window inner height is small than window height because of the browser frame
    `--window-size=1280,800`,
    `--disable-dev-shm-usage`, // https://github.com/puppeteer/puppeteer/blob/v1.20.0/docs/troubleshooting.md#tips
]

let proxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || process.env.https_proxy || process.env.http_proxy
if (proxy) {
    proxy = proxy.replace(/^http[s]?:\/\//, "").replace(/\/$/, "")
    launchArgs.push(`--proxy-server=${proxy}`)
}

/** @type {import('jest-playwright-preset').JestPlaywrightConfig} */
const config = {
    // serverOptions must be placed in root directory's jest-playwright.config.js: https://github.com/playwright-community/jest-playwright/blob/v1.4.2/src/global.ts#L29
    serverOptions: [
        // {
        //     command: `yarn editor dev`,
        //     port: 3001,
        //     launchTimeout: 60 * 1000,
        //     debug: true,
        //     protocol: "http-get",
        //     waitOnScheme: {
        //         verbose: true,
        //         interval: 1000,
        //         httpTimeout: 1000,
        //     },
        //     usedPortAction: "ignore",
        // },
        // {
        //     command: `yarn web dev`,
        //     port: 3000,
        //     options: {
        //         env: {
        //             NODE_ENV: "development",
        //             REACT_APP_TESTING: "yes",
        //         },
        //     },
        //     launchTimeout: 60 * 1000,
        //     debug: true,
        //     protocol: "http-get",
        //     waitOnScheme: {
        //         verbose: true,
        //         interval: 1000,
        //         httpTimeout: 1000,
        //     },
        //     usedPortAction: "ignore",
        // },
    ],
    collectCoverage: true,
    browsers: ["chromium"],
    launchOptions: {
        args: launchArgs,
        executablePath: process.env.PLAYWRIGHT_CHROME_EXECUTABLE_PATH,
        headless: true,
    },
}

module.exports = config
