// @ts-check

const isCI = !!process.env.CI

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
    files: ["./build/"],
    extraMetadata: {
        name: "Rino",
    },
    // skip notarization in local development
    afterSign: isCI ? "./notarize.js" : undefined,

    asar: isCI,

    // In order to make Windows auto update to work, I need to set the `artifactName` manually and
    // make sure it doesn't include any spaces.
    // Check this link for more details: https://github.com/electron-userland/electron-builder/issues/4223
    artifactName: "${productName}-v${version}-${os}-${arch}.${ext}",

    win: {
        target: [{ target: "nsis", arch: isCI ? ["ia32", "x64", "arm64"] : undefined }],
    },

    mac: {
        // https://developer.apple.com/library/ios/documentation/General/Reference/InfoPlistKeyReference/Articles/LaunchServicesKeys.html#//apple_ref/doc/uid/TP40009250-SW8
        category: "public.app-category.productivity",

        // Notice that mac dmg can only be built on macOS. https://github.com/electron-userland/electron-builder/issues/811#issuecomment-252558287
        // zip target for macOS is required for Squirrel.Mac.
        target: [
            { target: "zip", arch: isCI ? "universal" : undefined },
            { target: "dmg", arch: isCI ? "universal" : undefined },
        ],

        // skip signing in local development
        identity: isCI ? undefined : null,

        // https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/
        entitlements: "./entitlements.mac.plist",
    },

    linux: {
        // https://specifications.freedesktop.org/menu-spec/latest/apa.html#main-category-registry
        category: "Office",

        target: [
            { target: "AppImage", arch: isCI ? ["x64"] : undefined },
            { target: "snap", arch: isCI ? ["x64"] : undefined },
        ],
    },

    fileAssociations: {
        ext: "md",
    },

    publish: {
        // GitHub repository information is required for generating `latest.yml`
        provider: "github",
        owner: "ocavue",
        repo: "rino",
    },
}

module.exports = config
