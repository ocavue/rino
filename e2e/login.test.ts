import { waitForTestId } from "./utils"

export async function login() {
    await page.goto("http://localhost:1234/login")
    await page.waitForSelector(".login__message") // Auto login in test environment
    await page.goto("http://localhost:1234/e/")
}

describe("Login", function() {
    test("Not login", async () => {
        await page.goto("http://localhost:1234/")
        await waitForTestId(page, "sidebar-btn-sign-in")
    })

    test("Auto Login", async () => {
        await login()
    })

    test("After login", async () => {
        await waitForTestId(page, "sidebar-btn-create-note")
    })
})
