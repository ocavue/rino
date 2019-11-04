async function adjustVueCoverage() {
    // vuetify-loader will make coverage[<Vue-SFC-path>].inputSourceMap.sources[0] like
    // "vuetify-loader/lib/loader.js!cache-loader/dist/cjs.js??ref--0-0!vue-loader/lib/index.js??vue-loader-options!src/App.vue?vue&type=script&lang=ts&".
    // This function adjust it into a normal file path, so that `jest-puppeteer-istanbul` can handler it correctly.
    await page.evaluate(() => {
        for (let [file, coverage] of Object.entries(window.__coverage__ || {})) {
            coverage.path = file
            coverage.inputSourceMap.file = file
            coverage.inputSourceMap.sources = file
        }
    })
    // console.log(await page.evaluate(() => window.__coverage__))
}

afterEach(async () => {
    await adjustVueCoverage()
})
