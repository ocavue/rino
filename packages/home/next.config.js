const { readFileSync } = require("fs")
const { join } = require("path")
const getNextConfig = require("@rino.app/next/next.base.config")

const baseConfig = getNextConfig()

const version = readFileSync(join(__dirname, "..", "..", "version.txt"), "utf-8").trim()

module.exports = {
    ...baseConfig,
    env: {
        ...baseConfig.env,
        NEXT_PUBLIC_ELECTRON_VERSION: version,
    },
}
