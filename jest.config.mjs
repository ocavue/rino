// @ts-check

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
    // Indicates whether the coverage information should be collected while executing the test
    collectCoverage: false,

    // An array of glob patterns indicating a set of files for which coverage information should be collected
    collectCoverageFrom: ["src/**/*.(ts|tsx|js|jsx)", "!**/__test__/**"],

    // The directory where Jest should output its coverage files
    coverageDirectory: "coverage",

    // An array of regexp pattern strings used to skip coverage collection
    coveragePathIgnorePatterns: ["/node_modules/"],

    // A list of reporter names that Jest uses when writing coverage reports
    coverageReporters: ["text-summary", "json", "json-summary"],

    // Use this configuration option to add custom reporters to Jest
    reporters: ["default"],

    // An array of file extensions your modules use
    moduleFileExtensions: ["js", "json", "jsx", "mjs", "ts", "tsx", "node", "vue", "md"],

    // Stop running tests after `n` failures
    bail: 1,

    // Default timeout of a test in milliseconds.
    testTimeout: 30000,

    testSequencer: "./tests/jest-sequencer.js",

    projects: ["./packages/*/test/jest.config.mjs"],
}

export default config
