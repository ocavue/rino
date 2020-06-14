console.log("loading babel.config.js")

module.exports = function (api) {
    api.cache(true)

    const plugins = []
    if (process.env.NODE_ENV === "development" || process.env.REACT_APP_TESTING) {
        plugins.push("istanbul")
    }

    return {
        extends: "../../babel.config.json",
        plugins,
    }
}
