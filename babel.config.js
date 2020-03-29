// It is recommended to always use `babel.config.js` instead of other formats in Vue CLI projects.
// https://cli.vuejs.org/config/#babel

module.exports = function (api) {
    api.cache(true)

    const presets = ["next/babel"]
    const plugins = []

    if (process.env.NODE_ENV === "development" || process.env.REACT_APP_TESTING) {
        plugins.push("istanbul")
    }

    return {
        presets,
        plugins,
    }
}
