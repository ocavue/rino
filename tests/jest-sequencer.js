const TestSequencer = require("@jest/test-sequencer").default
const orderBy = require("lodash").orderBy

// Documents: https://jestjs.io/docs/en/24.8/configuration#testsequencer-string
class CustomSequencer extends TestSequencer {
    sort(tests) {
        const copyTests = Array.from(tests)
        // console.log(copyTests.map(t => t.path))
        return orderBy(copyTests, ["path"])
    }
}

module.exports = CustomSequencer
