/* eslint-disable @typescript-eslint/camelcase */

const readFileSync = require("fs").readFileSync
const execSync = require("child_process").execSync

process.env.VUE_APP_VERSION = JSON.parse(readFileSync("./package.json")).version
process.env.VUE_APP_COMMIT = `${execSync("git rev-parse --short HEAD")}`.trim()

module.exports = {
    lintOnSave: false,
    pwa: {
        // Documents for vue-cli pwa plugin: https://www.npmjs.com/package/@vue/cli-plugin-pwa
        name: "Rino",
        themeColor: "#ededed",
        display: "standalone",
        manifestOptions: {
            background_color: "#000000",
        },
    },
    css: {
        // Ignore mini-css-extract-plugin's "Conflicting order between:" error.
        // https://github.com/webpack-contrib/mini-css-extract-plugin/issues/250
        extract: { ignoreOrder: true },
    },
}
