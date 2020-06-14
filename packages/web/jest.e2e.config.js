// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

const baseConfig = require("../../tests/jest.base.config")

const base = {
    ...baseConfig,

    // All imported modules in your tests should be mocked automatically
    // automock: false,

    // Respect "browser" field in package.json when resolving modules
    // browser: false,

    // The directory where Jest should store its cached dependency information
    // cacheDirectory: "/private/var/folders/ww/l1nq1sx57xv1dscxsxq7mx0r0000gn/T/jest_dx",

    // Automatically clear mock calls and instances between every test
    // clearMocks: true,

    // An object that configures minimum threshold enforcement for coverage results
    // coverageThreshold: null,

    // A path to a custom dependency extractor
    // dependencyExtractor: null,

    // Make calling deprecated APIs throw helpful error messages
    // errorOnDeprecated: false,

    // Force coverage collection from ignored files using an array of glob patterns
    // forceCoverageMatch: [],

    // A path to a module which exports an async function that is triggered once before all test suites
    // globalSetup: null,

    // A path to a module which exports an async function that is triggered once after all test suites
    // globalTeardown: null,

    // A set of global variables that need to be available in all test environments
    // globals: {},

    // An array of directory names to be searched recursively up from the requiring module's location
    // moduleDirectories: [
    //   "node_modules"
    // ],

    // A map from regular expressions to module names that allow to stub out resources with a single module
    moduleNameMapper: {
        "^src/(.*)$": "<rootDir>/src/$1",
        "^tests/(.*)$": "<rootDir>/tests/$1",
    },

    // An array of regexp pattern strings, matched against all module paths before considered 'visible' to the module loader
    // modulePathIgnorePatterns: [],

    // Activates notifications for test results
    // notify: false,

    // An enum that specifies notification mode. Requires { notify: true }
    // notifyMode: "failure-change",

    // Automatically reset mock state between every test
    // resetMocks: false,

    // Reset the module registry before running each individual test
    // resetModules: false,

    // A path to a custom resolver
    // resolver: null,

    // Automatically restore mock state between every test
    // restoreMocks: false,

    // The root directory that Jest should scan for tests and modules within
    // rootDir: null,

    // A list of paths to directories that Jest should use to search for files in
    // roots: [
    //   "<rootDir>"
    // ],

    // Allows you to use a custom runner instead of Jest's default test runner
    // runner: "jest-runner",

    // The paths to modules that run some code to configure or set up the testing environment before each test
    // setupFiles: ["dotenv/config"],

    // A list of paths to snapshot serializer modules Jest should use for snapshot testing
    // snapshotSerializers: [],

    // The test environment that will be used for testing
    // testEnvironment: "node",

    // Options that will be passed to the testEnvironment
    // testEnvironmentOptions: {},

    // Adds a location field to test results
    // testLocationInResults: false,

    // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
    // testPathIgnorePatterns: [
    //   "/node_modules/"
    // ],

    // The regexp pattern or array of patterns that Jest uses to detect test files
    // testRegex: [],

    // This option allows the use of a custom results processor
    // testResultsProcessor: null,

    // This option allows use of a custom test runner
    // testRunner: "jasmine2",

    // This option sets the URL for the jsdom environment. It is reflected in properties such as location.href
    // testURL: "http://localhost",

    // Setting this value to "fake" allows the use of fake timers for functions such as "setTimeout"
    // timers: "real",

    // An array of regexp pattern strings that are matched against all modules before the module loader will automatically return a mock for them
    // unmockedModulePathPatterns: undefined,

    // Indicates whether each individual test should be reported during the run
    // verbose: null,

    // An array of regexp patterns that are matched against all source file paths before re-running tests in watch mode
    // watchPathIgnorePatterns: [],

    // Whether to use watchman for file crawling
    // watchman: true,

    // Default timeout of a test in milliseconds.
    testTimeout: 30000,
}

module.exports = {
    ...base,
    // projects: [
    //     {
    ...base,
    displayName: { name: "E2E", color: "magenta" },

    // The glob patterns Jest uses to detect test files
    // testMatch: ["<rootDir>/tests/e2e_NOT_EXIST/**/*.spec.(js|ts|jsx|tsx)"],
    testMatch: ["<rootDir>/tests/e2e/3.drawer/1.drawer-toggle.spec.ts"],

    // A preset that is used as a base for Jest's configuration
    preset: "jest-puppeteer",

    // A list of paths to modules that run some code to configure or set up the testing framework before each test
    setupFilesAfterEnv: [
        "jest-extended",
        "jest-puppeteer-istanbul/lib/setup",
        "<rootDir>/../../tests/wait-server.js",
    ],
    //     },
    //     {
}
