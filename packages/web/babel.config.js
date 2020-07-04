console.log("loading babel.config.js")

module.exports = function (api) {
    api.cache(true)

    const plugins = [
        [
            "inline-react-svg",
            {
                svgo: {
                    plugins: [
                        {
                            // Avoid react from complaining "Invalid attribute name: `'data-name'`"
                            removeAttrs: {
                                attrs: "(data-name)",
                            },
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
        extends: "../../babel.config.json",
        plugins,
    }
}
