/* eslint-disable @typescript-eslint/no-var-requires */
const TestSequencer = require("@jest/test-sequencer").default

// Documents: https://jestjs.io/docs/en/24.8/configuration#testsequencer-string
class CustomSequencer extends TestSequencer {
    sort(tests) {
        const copyTests = Array.from(tests)
        // console.log(copyTests.map(t => t.path))
        copyTests.sort((a, b) => {
            if (a.path < b.path) return -1
            if (a.path > b.path) return +1
            return 0
        })
        return copyTests
    }
}

module.exports = CustomSequencer
