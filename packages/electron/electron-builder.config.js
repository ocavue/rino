const now = new Date()
const buildVersion = `${now.getFullYear() - 2000}.${now.getMonth() + 1}.${now.getDate()}`

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
        version: buildVersion,
    },
}

module.exports = config
