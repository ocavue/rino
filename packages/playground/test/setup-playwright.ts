import Playwright from "playwright-chromium"
import { preview, PreviewServer } from "vite"

async function setupServer() {
    let server: PreviewServer | null = null
    try {
        server = await preview({ preview: { port: 3001, strictPort: true } })
    } catch (error) {
        if (String(error).match(/Port.*is already in use/)) {
            console.log("Port is already in use. Assume server is already running.")
        } else {
            throw error
        }
    }

    return () => {
        server?.httpServer.close()
    }
}

async function setupBrowser() {
    const browser = await Playwright.chromium.launch({
        headless: !!process.env.CI,
        executablePath: process.env.PLAYWRIGHT_CHROME_EXECUTABLE_PATH,
    })
    const page = await browser.newPage()

    globalThis.browser = browser
    globalThis.page = page

    return async () => {
        await browser.close()
    }
}

async function setup() {
    const teardownServer = await setupServer()
    const teardownBrowser = await setupBrowser()
    return () => {
        teardownServer()
        teardownBrowser()
    }
}

export default setup
