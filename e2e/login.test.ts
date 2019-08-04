import * as env from "../config/env.json"
import { waitForAsyncFunction } from "./utils"

export async function login() {
    await page.goto("http://localhost:1234/login")
    await page.waitForSelector(".login__message") // Auto login in test environment
    await page.goto("http://localhost:1234/e/")
}

async function expectSidebarUserText(expected: string) {
    await page.waitForSelector(".sidebar__user-text")
    const actual = await page.$eval(".sidebar__user-text", e => e.innerHTML)
    return actual.trim() === expected.trim()
}

describe("Login", function() {
    test("Not login", async () => {
        await page.goto("http://localhost:1234/")
        await waitForAsyncFunction(async () => {
            return await expectSidebarUserText("Not login")
        })
    })

    test("Auto Login", async () => {
        await login()
    })

    test("Show email in sidebar after login", async () => {
        const email = env.TEST_USERNAME
        await waitForAsyncFunction(async () => {
            return await expectSidebarUserText(email)
        })
    })
})
