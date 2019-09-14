async function adjustVueCoverage() {
    // vuetify-loader will make coverage[<Vue-SFC-path>].inputSourceMap.sources[0] like
    // "vuetify-loader/lib/loader.js!cache-loader/dist/cjs.js??ref--0-0!vue-loader/lib/index.js??vue-loader-options!src/App.vue?vue&type=script&lang=ts&".
    // This function adjust it into a normal file path, so that `jest-puppeteer-istanbul` can handler it correctly.
    const coverage = await page.evaluate(() => window.__coverage__)
    Object.values(coverage || {}).forEach(fileCoverage => {
        try {
            const inputSourceMap = fileCoverage.inputSourceMap
            const file = inputSourceMap.file
            const sources = inputSourceMap.sources
            if (file.endsWith(".vue.ts") && sources[0].endsWith("&")) {
                inputSourceMap.sources[0] = file
            }
        } catch (error) {
            console.error(error)
        }
    })
    await page.evaluate(coverage => (window.__coverage__ = coverage), coverage)
}

afterEach(async () => {
    await adjustVueCoverage()
})
