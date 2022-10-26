const { readFileSync } = require("fs")
const { join } = require("path")

const execSync = require("child_process").execSync
const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
})

function getEnvs() {
    const allEnvs = {
        ...process.env,
        REACT_APP_VERSION: JSON.parse(readFileSync("./package.json")).version,
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
            // https://nextjs.org/docs/api-reference/next.config.js/build-indicator
            buildActivityPosition: "bottom-left",
        },
        webpack: (config, options) => {
            config.module.rules.push({
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
            })
            return config
        },
        images: {
            disableStaticImages: true,
        },
        env: getEnvs(),
    }
}

const baseConfig = withBundleAnalyzer(getNextConfig())

const electronPackageJsonPath = join(__dirname, "..", "electron", "package.json")
const electronVersion = JSON.parse(readFileSync(electronPackageJsonPath, "utf-8")).version

module.exports = {
    ...baseConfig,
    env: {
        ...baseConfig.env,
        NEXT_PUBLIC_RINO_VERSION: electronVersion,
    },

    // disable the built-in eslint step completely.
    eslint: {
        ignoreDuringBuilds: true,
    },
}
