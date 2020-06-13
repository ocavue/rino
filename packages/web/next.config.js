/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs")
const path = require("path")
const execSync = require("child_process").execSync
const dotenv = require("dotenv")

const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin")
const withOffline = require("next-offline")
const withImages = require("next-images")
const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
})

const allEnvVars = {
    ...process.env,
    ...(fs.existsSync(".env") ? dotenv.parse(fs.readFileSync(".env")) : {}),
    REACT_APP_VERSION: JSON.parse(fs.readFileSync("./package.json")).version,
    REACT_APP_COMMIT: `${execSync("git rev-parse --short HEAD")}`.trim(),
}
const appEnvVars = Object.keys(allEnvVars)
    .filter((key) => {
        return (
            key.startsWith("REACT_APP") ||
            ["FIREBASE_DATABASE_EMULATOR_HOST", "FIRESTORE_EMULATOR_HOST"].includes(key)
        )
    })
    .reduce((obj, key) => {
        obj[key] = allEnvVars[key]
        return obj
    }, {})

const nextConfig = {
    // Next config
    exportTrailingSlash: true,
    devIndicators: {
        // Disable Next.js's prerender icon in the right bottom corner
        // of the screen, who cover the sign-in snackbar.
        autoPrerender: false,
    },
    webpack: (config, options) => {
        // https://github.com/zeit/next.js/issues/7935
        // https://github.com/zeit/next.js/issues/7779
        if (config.resolve.plugins) {
            config.resolve.plugins.push(new TsconfigPathsPlugin())
        } else {
            config.resolve.plugins = [new TsconfigPathsPlugin()]
        }

        config.module.rules.push({
            test: /\.(md|txt)$/i,
            use: ["raw-loader"],
        })

        return config
    },
    env: appEnvVars,

    // next-image config
    esModule: true,
    exclude: path.resolve(__dirname, "src/assets/svg/"),
}

module.exports = withBundleAnalyzer(withOffline(withImages(nextConfig)))
