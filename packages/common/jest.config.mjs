// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

import baseConfig from "../../tests/jest.base.config.mjs"

export default {
    ...baseConfig,

    displayName: { name: "COMMON:UNIT", color: "magentaBright" },
}
