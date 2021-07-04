const fs = require("fs")
const execSync = require("child_process").execSync
const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
})

function getEnvs() {
    const allEnvs = {
        ...process.env,
        REACT_APP_VERSION: JSON.parse(fs.readFileSync("./package.json")).version,
        REACT_APP_COMMIT: `${execSync("git rev-parse --short HEAD")}`.trim(),
    }
    const exported = {}
    for (const key of Object.keys(allEnvs)) {
        if (key === "FIREBASE_DATABASE_EMULATOR_HOST" || key === "FIRESTORE_EMULATOR_HOST" || key.startsWith("REACT_APP")) {
            exported[key] = allEnvs[key]
        }
    }
    return exported
}

function getNextConfig() {
    return {
        // Next config
        productionBrowserSourceMaps: true,
        trailingSlash: false,
        devIndicators: {
            // Disable Next.js's prerender icon in the right bottom corner
            // of the screen.
            autoPrerender: false,
        },
        webpack: (config, options) => {
            config.module.rules.push(
                {
                    test: /\.(jpe?g|png|webp)$/i,
                    use: [
                        {
                            loader: "responsive-loader",
                            options: {
                                adapter: require("responsive-loader/sharp"),
                                sizes: [320, 640, 960, 1200, 2400],
                                placeholder: false,
                                esModule: true,
                                outputPath: "static/images/_responsive/",
                                publicPath: "_next/static/images/_responsive/",
                            },
                        },
                    ],
                },
                {
                    test: /\.svg$/i,
                    use: [
                        {
                            loader: "@svgr/webpack",
                            options: {
                                svgoConfig: {
                                    plugins: [
                                        {
                                            // SVGO will remove the svg attribute `viewBox` by default,
                                            // which will stop me from resizing the image by setting
                                            // `width` and `height`.
                                            removeViewBox: false,
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                },
            )
            return config
        },
        env: getEnvs(),
    }
}

module.exports = () => withBundleAnalyzer(getNextConfig())
