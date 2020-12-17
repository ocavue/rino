import "jest"

describe("Settings", () => {
    beforeAll(async () => {
        await page.goto("http://localhost:3001")
    })

    test("header", async () => {
        const browser = await page.$eval(".dev-header", (el) => el.innerHTML)
        expect(browser).toContain("development")
    })
})
