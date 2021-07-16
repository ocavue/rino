// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

import baseConfig from "../../../tests/jest.base.config.mjs"

export default {
    ...baseConfig,

    displayName: { name: "EDITOR:UNIT", color: "blackBright" },

    // A list of paths to modules that run some code to configure or set up the testing framework before each test
    setupFilesAfterEnv: ["jest-extended", "jest-prosemirror/environment", "jest-remirror/environment"],

    // Required for dom jest-prosemirror and jest-remirror
    testEnvironment: "jsdom",
}
