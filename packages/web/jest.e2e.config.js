/* Copyright (c) 2020-present ocavue@gmail.com */

// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

const baseConfig = require("../../tests/jest.base.config")

module.exports = {
    ...baseConfig,

    displayName: { name: "E2E", color: "magenta" },

    // The glob patterns Jest uses to detect test files
    testMatch: ["<rootDir>/tests/e2e/**/*.spec.(js|ts|jsx|tsx)"],

    // A preset that is used as a base for Jest's configuration
    preset: "jest-puppeteer",

    // A list of paths to modules that run some code to configure or set up the testing framework before each test
    setupFilesAfterEnv: [
        "jest-extended",
        "jest-puppeteer-istanbul/lib/setup",
        "<rootDir>/../../tests/wait-server.js",
        "<rootDir>/../../tests/load-dotenv.js",
    ],
}
