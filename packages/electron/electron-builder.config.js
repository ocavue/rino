// @ts-check

const fs = require("fs")
const path = require("path")

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"), { encoding: "utf-8" }))

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
    productName: "Rino",
    directories: {
        output: "dist",
        buildResources: "resources",
    },
    files: ["src/main/dist/**", "src/renderer/dist/**"],
    extraMetadata: {
        name: "Rino",
    },

    mac: {
        // https://developer.apple.com/library/ios/documentation/General/Reference/InfoPlistKeyReference/Articles/LaunchServicesKeys.html#//apple_ref/doc/uid/TP40009250-SW8
        category: "public.app-category.productivity",
    },

    publish: ["github"],
    releaseInfo: {
        // Match the style of changesets release name
        releaseName: `${packageJson.name}@${packageJson.version}`,
    },
}

module.exports = config
