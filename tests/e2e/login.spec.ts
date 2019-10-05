import { login } from "./actions"
import { goto, type, click, wait, getInnerText } from "./utils"

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
        expect(await getInnerText("login-error")).toEqual(
            "Error: The email address is badly formatted",
        )
    })

    test.only("Vaild email", async () => {
        await goto("/login")
        await wait("login-error", { hidden: true })
        await type("login-text-field", "VAILD_EMAIL@test.rino.app")
        await click("login-btn")
        expect(await getInnerText("login-message")).toEqual(
            "A sign-in email with additional instructions was sent to VAILD_EMAIL@test.rino.app. Check your email to complete sign-in.",
        )
    })
})
