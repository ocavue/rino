describe("Smooth test", function() {
    test("Sidebar", async () => {
        await page.goto("http://localhost:1234")
        await page.waitForSelector(".sidebar__main-button")
    })
})
