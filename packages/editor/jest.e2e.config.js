/* Copyright (c) 2020-present ocavue@gmail.com */

// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

const baseConfig = require("../../tests/jest.base.config")

module.exports = {
    ...baseConfig,

    displayName: { name: "EDITOR:E2E", color: "blackBright" },

    // The glob patterns Jest uses to detect test files
    testMatch: ["**/*.e2e.spec.(js|ts|jsx|tsx)"],

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
