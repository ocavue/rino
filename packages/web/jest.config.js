// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

const baseConfig = require("../../tests/jest.base.config")

module.exports = {
    ...baseConfig,

    displayName: { name: "WEB:UNIT", color: "cyan" },

    // The glob patterns Jest uses to detect test files
    testMatch: ["**/__test__/**/*.spec.(js|ts|jsx|tsx)"],

    // A list of paths to modules that run some code to configure or set up the testing framework before each test
    setupFilesAfterEnv: [
        "jest-extended",
        "jest-prosemirror/environment",
        "jest-remirror/environment",
    ],

    // Required for dom jest-prosemirror and jest-remirror
    testEnvironment: "jsdom",
}
