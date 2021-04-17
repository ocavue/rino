// @ts-check

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

    mac: {
        // https://developer.apple.com/library/ios/documentation/General/Reference/InfoPlistKeyReference/Articles/LaunchServicesKeys.html#//apple_ref/doc/uid/TP40009250-SW8
        category: "public.app-category.productivity",
    },

    publish: ["github"],
}

module.exports = config
