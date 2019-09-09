describe("Network environment", () => {
    const timeout = 30000 // 30 second timeout
    jest.setTimeout(timeout)
    test("Bing", async () => await page.goto("https://bing.com", { timeout }))
    test("Google", async () => await page.goto("https://google.com", { timeout }))
    test("Facebook", async () => await page.goto("https://facebook.com", { timeout }))
})
