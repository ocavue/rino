// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

const baseConfig = require("../../tests/jest.base.config")

module.exports = {
    ...baseConfig,

    displayName: { name: "COMMON:UNIT", color: "magentaBright" },

    // The glob patterns Jest uses to detect test files
    testMatch: ["**/__test__/**/*.spec.(js|ts|jsx|tsx)"],

    coveragePathIgnorePatterns: ["<rootDir>/src/index.tsx", "/node_modules/"],
}
