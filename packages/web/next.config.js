const getNextConfig = require("@rino.app/next/dist/next.base.config")
const withOffline = require("next-offline")

module.exports = withOffline(getNextConfig())
