// It is recommended to always use `babel.config.js` instead of other formats in Vue CLI projects.
// https://cli.vuejs.org/config/#babel

module.exports = function (api) {
    api.cache(true)

    const presets = ["next/babel"]
    const plugins = [
        [
            "inline-react-svg",
            {
                svgo: {
                    plugins: [
                        {
                            // Avoid react from complaining "Invalid attribute name: `'data-name'`"
                            removeAttrs: { attrs: "(data-name)" },
                        },
                        {
                            // Remove the <style> part so that I can change the svg style with JavaScript
                            removeStyleElement: true,
                        },
                    ],
                },
            },
        ],
    ]

    if (process.env.NODE_ENV === "development" || process.env.REACT_APP_TESTING) {
        plugins.push("istanbul")
    }

    return {
        presets,
        plugins,
    }
}
