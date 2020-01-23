import { click, getInnerText, getTextAreaValue, goto, sleep, type, wait } from "./utils"
import { login } from "./actions"

describe("Sign-in for development", function() {
    test("Automatically sign in", async () => {
        await login()
    })
})

describe("Sign-in for production", function() {
    const invaildEmail = "INVAILD_EMAIL@@test.rino.app"
    const vaildEmail = "VAILD_EMAIL@test.rino.app"

    async function expectLoginCard() {
        await wait("login-form-card")
    }
    async function expectResultCard() {
        await wait("login-result-card")
    }
    async function login(email: string) {
        // Before login
        await goto("/sign-in")
        await expectLoginCard()
        await wait("login-error", { hidden: true })

        // Login
        await type("login-text-field", email)
        await sleep(10)
        await click("login-next-btn")
    }

    test("Invaild email", async () => {
        await login(invaildEmail)
        await expectLoginCard()
        expect(await getInnerText("login-error")).toEqual(
            "Error: The email address is badly formatted.",
        )
    })

    test("Vaild email", async () => {
        await login(vaildEmail)
        await expectResultCard()
        expect(await getInnerText("login-message")).toEqual(
            `A sign-in email with additional instructions was sent to ${vaildEmail}. Check your email to complete sign-in.`,
        )
    })

    test("Back", async () => {
        await login(vaildEmail)
        await expectResultCard()
        await click("login-back-btn")
        await expectLoginCard() // Go back to login form
        expect(await getTextAreaValue("login-text-field")).toEqual(vaildEmail)
    })

    test("Cancel", async () => {
        await goto("/sign-in")
        await click("login-cancel-btn")
        await wait("sidebar") // Go back to main page
    })

    test("Finish sign up", async () => {
        await goto("/finish-sign-up")
        await wait("finish-sign-up")
    })
})
