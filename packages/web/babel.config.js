const config = require( '../../babel.config.js')

module.exports = function (api) {

    output = config(api)

    if (process.env.NODE_ENV === "development" || process.env.REACT_APP_TESTING) {
        output.plugins.push("istanbul")
    }

    return output
}
