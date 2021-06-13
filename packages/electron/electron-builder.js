// @ts-check

const isCI = !!process.env.CI
const macArch = isCI ? "universal" : undefined

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
    files: ["main/dist/**", "preload/dist/**", "renderer/dist/**"],
    extraMetadata: {
        name: "Rino",
    },

    asar: isCI,

    mac: {
        // https://developer.apple.com/library/ios/documentation/General/Reference/InfoPlistKeyReference/Articles/LaunchServicesKeys.html#//apple_ref/doc/uid/TP40009250-SW8
        category: "public.app-category.productivity",

        // Notice that mac dmg can only be built on macOS. https://github.com/electron-userland/electron-builder/issues/811#issuecomment-252558287
        // zip target for macOS is required for Squirrel.Mac.
        target: [
            { target: "zip", arch: macArch },
            { target: "dmg", arch: macArch },
        ],

        hardenedRuntime: true,
    },

    fileAssociations: {
        ext: "md",
    },
}

module.exports = config
