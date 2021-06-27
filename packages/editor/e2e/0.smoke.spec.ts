import "jest"

import { setupEditor } from "./utils"

describe("Smoke", () => {
    beforeAll(async () => {
        await setupEditor()
    })

    test("editor", async () => {
        const s = ".markdown-body > .ProseMirror"
        await page.waitForSelector(s, { timeout: 60 * 1000 })

        await page.focus(s)
        await page.type(s, "12345")

        expect(await page.$eval(s, (el) => el.innerHTML)).toContain("12345")
    })
})
