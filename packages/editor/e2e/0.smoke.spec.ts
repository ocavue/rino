import { setupEditor } from "./utils"

describe("Smoke", () => {
    beforeAll(async () => {
        await setupEditor()
    })

    test("editor", async () => {
        const selector = ".markdown-body > .ProseMirror"
        await page.waitForSelector(selector, { timeout: 60 * 1000 })

        await page.focus(selector)
        await page.type(selector, "12345")

        expect(await page.$eval(selector, (el) => el.innerHTML)).toContain("12345")
    })
})
