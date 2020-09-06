const baseConfig = require("@rino.app/next/src/babel.base.config.js")

module.exports = function (api) {
    console.log("loading", __filename)
    return baseConfig(api)
}
