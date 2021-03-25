/* Copyright (c) 2020-present ocavue@gmail.com */

const baseConfig = require("@rino.app/next/babel.base.config.js")

module.exports = function (api) {
    console.log("loading", __filename)
    return baseConfig(api)
}
