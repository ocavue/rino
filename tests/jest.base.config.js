module.exports = {
    // A map from regular expressions to paths to transformers
    transform: {
        ".*\\.ts(x)?$": "babel-jest",
        ".*\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2|md)$": "jest-transform-stub",
    },

    // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
    transformIgnorePatterns: ["/node_modules/"],

    // Use this configuration option to add custom reporters to Jest
    reporters: ["default", "jest-puppeteer-istanbul/lib/reporter"],
}
