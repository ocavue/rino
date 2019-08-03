export async function login() {
    await page.goto("http://localhost:1234/login")
    await page.waitForSelector(".login__message")
    await page.goto("http://localhost:1234/")
}

describe("Login", function() {
    test("Login", async () => {
        await login()
    })
})
