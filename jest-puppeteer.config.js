module.exports = {
    // Puppeteer launch options
    // See https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions for all launch options
    launch: {
        // Only use headful mode when debuging in local machines
        headless: process.env.PUPPETEER_HEADLESS !== "false",

        // Window inner height is small than window height because of the browser frame
        args: [`--window-size=1280,800`],

        // `null` disables the default viewport. So the viewport size is always equal to the window inner size
        defaultViewport: null,
    },
}
