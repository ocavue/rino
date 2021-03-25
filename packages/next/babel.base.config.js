/* Copyright (c) 2020-present ocavue@gmail.com */

module.exports = function (api) {
    console.log("loading", __filename)
    api.cache(true)

    const plugins = []
    if (process.env.NODE_ENV === "development" || process.env.REACT_APP_TESTING) {
        plugins.push("istanbul")
    }

    return {
        presets: ["next/babel"],
        plugins,
    }
}
