const readFileSync = require("fs").readFileSync
const execSync = require("child_process").execSync

process.env.VUE_APP_VERSION = JSON.parse(readFileSync("./package.json")).version
process.env.VUE_APP_COMMIT = `${execSync("git rev-parse --short HEAD")}`.trim()

module.exports = {
    lintOnSave: false,
    pwa: {
        name: "Rino",
        themeColor: "#ededed",
        assetsVersion: "1",
    },
    css: {
        // Ignore mini-css-extract-plugin's "Conflicting order between:" error.
        // https://github.com/webpack-contrib/mini-css-extract-plugin/issues/250
        extract: { ignoreOrder: true },
    },
}
