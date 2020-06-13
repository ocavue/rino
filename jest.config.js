module.exports = {
    testSequencer: require("path").join(__dirname, "tests", "jest-sequencer.js"),

    projects: [
      '<rootDir>/packages/web/jest.config.js'
    ]
  }
