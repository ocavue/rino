import { goto, wait, click, getInnerText, sleep } from "./utils"

describe("About", function() {
    test("Open the dialog", async () => {
        await goto("/")
        await click("appbar-btn-dots")
        await sleep(200)
        await click("appbar-menu-item-about")
        await wait("about-dialog")
    })

    test("Check version format", async () => {
        // Should be something like 'Version 0.23.4 (2fd4e1c)'
        const received = await getInnerText("about-dialog-version")
        const expected = expect.stringMatching(/^Version \d+\.\d+.\d+ \([0-9a-z]{7}\)$/)
        expect(received).toEqual(expected)
    })

    test("Check copyright format", async () => {
        const year = new Date().getFullYear()
        const received = await getInnerText("about-dialog-copyright")
        const expected = `Copyright © ${year} Ocavue. All rights reserved.`
        expect(received).toEqual(expected)
    })

    test("Open the dialog", async () => {
        await page.mouse.click(5, 5)
        await wait("about-dialog", { hidden: true })
    })
})
