// @ts-check

// This file stores all shared Jest config for each packages

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
    extensionsToTreatAsEsm: [".ts"],
    globals: {
        "ts-jest": {
            useESM: true,
        },
    },

    // A map from regular expressions to paths to transformers
    transform: {
        ".*\\.(ts|tsx)$": "ts-jest",
        ".*\\.(js|jsx)$": "babel-jest",
        ".*\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2|md|svg)$": "jest-transform-stub",
    },

    // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
    transformIgnorePatterns: ["/node_modules/"],

    testPathIgnorePatterns: ["/node_modules/", "/dist/"],

    // A map from regular expressions to module names that allow to stub out resources with a single module
    moduleNameMapper: {
        "\\.svg$": `<rootDir>/../../tests/__mocks__/svgrMock.js`,
        "^src/(.*)$": "<rootDir>/src/$1",
        "^tests/(.*)$": "<rootDir>/tests/$1",
    },
}

export default config
