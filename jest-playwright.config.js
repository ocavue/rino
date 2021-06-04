// @ts-check

/** @type {import('jest-playwright-preset').JestPlaywrightConfig} */
const config = {
    // serverOptions must be placed in root directory's jest-playwright.config.js: https://github.com/playwright-community/jest-playwright/blob/v1.4.2/src/global.ts#L29
    serverOptions: {
        command: `yarn run exec editor dev`,
        options: {
            env: {
                REACT_APP_TESTING: "yes",
                NODE_ENV: "test",
            },
        },
        launchTimeout: 20 * 1000,
        debug: true,
        protocol: "http-get",
        waitOnScheme: {
            verbose: false,
            interval: 1000,
            validateStatus: (status) => {
                // https://github.com/jeffbski/wait-on/issues/78
                return (200 <= status && status < 300) || status === 404
            },
        },
        port: 3001,
        usedPortAction: "ignore",
    },
    browsers: ["chromium"],
}

module.exports = config
