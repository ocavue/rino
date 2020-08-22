/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs")
const execSync = require("child_process").execSync

const withOffline = require("next-offline")
const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
})

const envs = (() => {
    const allEnvs = {
        ...process.env,
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
    trailingSlash: true,
    devIndicators: {
        // Disable Next.js's prerender icon in the right bottom corner
        // of the screen.
        autoPrerender: false,
    },
    webpack: (config, options) => {
        config.module.rules.push(
            {
                test: /\.(md|txt)$/i,
                use: ["raw-loader"],
            },
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
        )
        return config
    },
    env: envs,
}

module.exports = withBundleAnalyzer(withOffline(nextConfig))
