// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

import baseConfig from "../../../tests/jest.base.config.mjs"

export default {
    ...baseConfig,

    displayName: { name: "EDITOR:E2E", color: "blackBright" },

    preset: "jest-playwright-preset",

    testEnvironmentOptions: {
        "jest-playwright": {
            launchOptions: {
                executablePath: process.env.PLAYWRIGHT_CHROME_EXECUTABLE_PATH,
                headless: true,
            },
            collectCoverage: true, // TODO: respect jest's --coverage flag
        },
    },
}
