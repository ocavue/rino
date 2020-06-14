// This file stores all shared Jest config for each packages

module.exports = {
    // A map from regular expressions to paths to transformers
    transform: {
        ".*\\.ts(x)?$": "babel-jest",
        ".*\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2|md)$": "jest-transform-stub",
    },

    // A map from regular expressions to module names that allow to stub out resources with a single module
    moduleNameMapper: {
        "^src/(.*)$": "<rootDir>/src/$1",
        "^tests/(.*)$": "<rootDir>/tests/$1",
    },

    // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
    transformIgnorePatterns: ["/node_modules/"],
}
