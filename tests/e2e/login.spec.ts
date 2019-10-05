import { login } from "./actions"
import { goto, type, click, wait, getOne } from "./utils"

describe("Sign-in for development", function() {
    test("Automatically sign in", async () => {
        await login()
    })
})

describe("Sign-in for production", function() {
    test("Invaild email", async () => {
        await goto("/login")
        await wait("login-error", { hidden: true })
        await type("login-text-field", "INVAILD_EMAIL@@test.rino.app")
        await click("login-btn")
        await wait("login-error")
        let errorMessage = await getOne("login-error")
        expect(errorMessage).toBeTruthy()
        let text = await page.evaluate(e => e.textContent, errorMessage)
        expect((text as string).includes("Error: The email address is badly formatted"))
    })

    test("Vaild email", async () => {
        await goto("/login")
        await wait("login-error", { hidden: true })
        await type("login-text-field", "VAILD_EMAIL@test.rino.app")
        await click("login-btn")
        await wait("login-error")
        let errorMessage = await getOne("login-error")
        expect(errorMessage).toBeTruthy()
        let text = await page.evaluate(e => e.textContent, errorMessage)
        expect((text as string).includes("Error: The email address is badly formatted"))
    })
})
