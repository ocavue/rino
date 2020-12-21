module.exports = {
    // serverOptions must be placed in root directory's jest-playwright.config.js: https://github.com/playwright-community/jest-playwright/blob/v1.4.2/src/global.ts#L29
    serverOptions: {
        command: `yarn editor dev`,
        options: {
            env: {
                REACT_APP_TESTING: "yes",
            },
        },
        launchTimeout: 60 * 1000,
        debug: true,
        protocol: "http-get",
        waitOnScheme: {
            verbose: false,
            interval: 1000,
        },
        port: 3001,
        usedPortAction: "ignore",
    },
}
