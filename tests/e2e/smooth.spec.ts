describe("Smooth test", function() {
    test("Sidebar", async () => {
        await page.goto("http://localhost:8080")
        await page.waitForSelector(".sidebar")
        await page.waitForSelector(".appbar")
    })
})
