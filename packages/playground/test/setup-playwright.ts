import Playwright from "playwright-chromium"
import { preview, PreviewServer } from "vite"

import { setupCoverageDir } from "./coverage"

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

    return async () => {
        await new Promise<void>((resolve, reject) => {
            if (server) {
                server.httpServer.close((error) => (error ? reject(error) : resolve()))
            } else {
                resolve()
            }
        })
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
    await setupCoverageDir()

    return () => {
        return Promise.all([teardownServer(), teardownBrowser()])
    }
}

export default setup
