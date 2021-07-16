// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

import baseConfig from "../../../tests/jest.base.config.mjs"

// Use `test/tsconfig.json` instead of `tsconfig.json` because
// 1. we need to use `"jsx": "react"` in order to make Jest work with tsx files.
// 2. Next.js forces us to use `"jsx": "preserve"` in `tsconfig.json`.
// const baseConfigClone = _.cloneDeep(baseConfig)
// baseConfigClone.globals["ts-jest"].tsconfig = "<rootDir>/test/tsconfig.json"

export default {
    ...baseConfig,

    displayName: { name: "HOME:UNIT", color: "blue" },

    testEnvironment: "jsdom",

    // A list of paths to modules that run some code to configure or set up the testing framework before each test
    setupFilesAfterEnv: ["jest-extended", "@testing-library/jest-dom"],

    coveragePathIgnorePatterns: ["/node_modules/"],
}
