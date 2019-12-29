/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
async function debug() {
    console.log(
        await page.evaluate(() => {
            const result = {}
            for (const [file, coverage] of Object.entries(window.__coverage__ || {})) {
                result[file] = {
                    path: coverage.path,
                    inputSourceMap: {
                        file: coverage.inputSourceMap.file,
                        sources: coverage.inputSourceMap.sources,
                    },
                }
            }
            return JSON.stringify(result, null, 2)
        }),
    )
}

async function adjustVueCoverage() {
    // vuetify-loader will make coverage[<Vue-SFC-path>].inputSourceMap.sources[0] like
    // "vuetify-loader/lib/loader.js!cache-loader/dist/cjs.js??ref--0-0!vue-loader/lib/index.js??vue-loader-options!src/App.vue?vue&type=script&lang=ts&".
    // This function adjust it into a normal file path, so that `jest-puppeteer-istanbul` can handler it correctly.

    // await debug()
    await page.evaluate(() => {
        for (const [file, coverage] of Object.entries(window.__coverage__ || {})) {
            coverage.path = file
            coverage.inputSourceMap.file = file
            coverage.inputSourceMap.sources = [file]
        }
    })
}

afterEach(async () => {
    await adjustVueCoverage()
})
