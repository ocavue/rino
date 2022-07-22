import { afterAll, beforeAll } from "vitest"

import { collectJSCoverage, startJSCoverage } from "./coverage"

async function setupBrowser() {
    const Playwright = await import("playwright-chromium")
    const browser = await Playwright.chromium.launch({
        // Default to use headless mode in the CI piplines or GitHub Codespaces
        headless: !!(process.env.CI || process.env.CODESPACES),
        executablePath: process.env.PLAYWRIGHT_CHROME_EXECUTABLE_PATH,
    })
    const page = await browser.newPage()

    globalThis.browser = browser
    globalThis.page = page
}

if (!globalThis.browser) {
    await setupBrowser()
}

beforeAll(async () => {
    await startJSCoverage()
})

afterAll(async () => {
    await collectJSCoverage()
})
