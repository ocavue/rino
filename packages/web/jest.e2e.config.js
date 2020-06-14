// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

const baseConfig = require("../../tests/jest.base.config")

module.exports = {
    ...baseConfig,

    // A map from regular expressions to module names that allow to stub out resources with a single module
    moduleNameMapper: {
        "^src/(.*)$": "<rootDir>/src/$1",
        "^tests/(.*)$": "<rootDir>/tests/$1",
    },

    displayName: { name: "E2E", color: "magenta" },

    // The glob patterns Jest uses to detect test files
    // testMatch: ["<rootDir>/tests/e2e_NOT_EXIST/**/*.spec.(js|ts|jsx|tsx)"],
    testMatch: ["<rootDir>/tests/e2e/1.not-found.spec.ts"],

    // A preset that is used as a base for Jest's configuration
    preset: "jest-puppeteer",

    // A list of paths to modules that run some code to configure or set up the testing framework before each test
    setupFilesAfterEnv: [
        "jest-extended",
        "jest-puppeteer-istanbul/lib/setup",
        "<rootDir>/../../tests/wait-server.js",
    ],
}
