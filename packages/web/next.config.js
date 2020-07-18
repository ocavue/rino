/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs")
const path = require("path")
const execSync = require("child_process").execSync
const dotenv = require("dotenv")

const withOffline = require("next-offline")
const withImages = require("next-images")
const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
})

const envs = (() => {
    const allEnvs = {
        ...process.env,
        ...(fs.existsSync(".env") ? dotenv.parse(fs.readFileSync(".env")) : {}),
        REACT_APP_VERSION: JSON.parse(fs.readFileSync("./package.json")).version,
        REACT_APP_COMMIT: `${execSync("git rev-parse --short HEAD")}`.trim(),
    }
    const exported = {}
    for (let key of Object.keys(allEnvs)) {
        if (
            key === "FIREBASE_DATABASE_EMULATOR_HOST" ||
            key === "FIRESTORE_EMULATOR_HOST" ||
            key.startsWith("REACT_APP")
        ) {
            exported[key] = allEnvs[key]
        }
    }
    return exported
})()

const nextConfig = {
    // Next config
    exportTrailingSlash: true,
    devIndicators: {
        // Disable Next.js's prerender icon in the right bottom corner
        // of the screen.
        autoPrerender: false,
    },
    webpack: (config, options) => {
        config.module.rules.push({
            test: /\.(md|txt)$/i,
            use: ["raw-loader"],
        })
        return config
    },
    env: envs,

    // next-images config
    esModule: true,
    exclude: path.resolve(__dirname, "src/assets/svg/"),
}

module.exports = withBundleAnalyzer(withOffline(withImages(nextConfig)))
