import { waitForTestId } from "./utils"

export async function login() {
    await page.goto("http://localhost:8080/login")
    await page.waitForSelector(".login__message") // Auto login in test environment
    await page.goto("http://localhost:8080/e/")
}

describe("Login", function() {
    jest.setTimeout(20000)

    test("Not login", async () => {
        await page.goto("http://localhost:8080/")
        await waitForTestId(page, "sidebar-btn-sign-in")
    })

    test("Auto Login", async () => {
        await login()
    })

    test("After login", async () => {
        await waitForTestId(page, "sidebar-btn-create-note")
    })
})
