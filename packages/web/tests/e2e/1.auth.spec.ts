import { login } from "./actions"
import { click, getInnerText, goto, pressKey, sleep, type, wait } from "./utils"

const username = process.env["REACT_APP_TEST_USERNAME"]
const password = process.env["REACT_APP_TEST_PASSWORD"]
const invaildEmail = "INVAILD_EMAIL@@test.rino.app"

describe("Sign-in for development", () => {
    test("Automatically signn", async () => {
        await login()
    })
})

test("environment variables", () => {
    expect(username).toBeTruthy()
    expect(password).toBeTruthy()
})

describe("Sign-in", () => {
    async function signIn(email: string, password: string, submitByEnter = false) {
        // Before sign-in
        await goto("/sign-in")
        await wait("auth_signin_form")
        await wait("auth_error", { hidden: true })

        // sign-in
        await type("auth_signin_password_textfield", password, false)
        await type("auth_signin_username_textfield", email, false)
        await sleep(10)
        if (submitByEnter) {
            await pressKey("Enter")
        } else {
            await click("auth_signin_submit")
        }
    }

    test("with invaild email", async () => {
        await signIn(invaildEmail, "abcdefg")
        await wait("auth_signin_form")
        expect(await getInnerText("auth_error")).toEqual("Error: The email address is badly formatted.")
    })

    test("with clicking submit button", async () => {
        await signIn(username, password, false)
        // go to the index page after sign-in successfully
        await wait("workspace")
    })

    test("with pressing Enter key", async () => {
        await signIn(username, password, true)
        // go to the index page after sign-in successfully
        await wait("workspace")
    })
})

describe("Sign-up", () => {
    async function signUp(email: string, password: string, submitByEnter = false) {
        // Before sign-up
        await goto("/sign-up")
        await wait("auth_signup_form")
        await wait("auth_error", { hidden: true })

        // sign-up
        await type("auth_signup_password_textfield", password, false)
        await type("auth_signup_username_textfield", email, false)
        await sleep(10)
        if (submitByEnter) {
            await pressKey("Enter")
        } else {
            await click("auth_signup_submit")
        }
    }

    test("with invaild email", async () => {
        await signUp(invaildEmail, "abcdefg")
        await wait("auth_signup_form")
        expect(await getInnerText("auth_error")).toEqual("Error: The email address is badly formatted.")
    })

    test("with used email", async () => {
        await signUp(username, "abcdefg")
        await wait("auth_signup_form")
        expect(await getInnerText("auth_error")).toEqual("Error: The email address is already in use by another account.")
    })
})

describe("Password reset", () => {
    async function resetPassword(email: string, password: string, submitByEnter = false) {
        // Before password-reset
        await goto("/password-reset")
        await wait("auth_password_reset_form")
        await wait("auth_error", { hidden: true })

        // password-reset
        await type("auth_password_reset_username_textfield", email, false)
        await sleep(10)
        if (submitByEnter) {
            await pressKey("Enter")
        } else {
            await click("auth_password_reset_submit")
        }
    }

    test("with vaild email", async () => {
        await resetPassword(username, "abcdefg123!", true)
        expect(await getInnerText("auth_password_reset_result")).toEqual(
            `We've progressed an email to ${username}. Click the link in the email to reset your password.`,
        )

        await resetPassword(username, "abcdefg123!", false)
        expect(await getInnerText("auth_password_reset_result")).toEqual(
            `We've progressed an email to ${username}. Click the link in the email to reset your password.`,
        )
    })

    test("with invaild email", async () => {
        await resetPassword(invaildEmail, "abcdefg123!")
        expect(await getInnerText("auth_error")).toEqual("Error: The email address is badly formatted.")
    })
})
