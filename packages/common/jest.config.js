// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

const baseConfig = require("../../tests/jest.base.config")

module.exports = {
    ...baseConfig,

    displayName: { name: "COMMON:UNIT", color: "magentaBright" },
}
