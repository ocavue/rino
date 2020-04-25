import { SIGN_IN_SNACKBAR_SHOW_DELAY } from "src/constants"

import { login, signOut } from "./actions"
import { click, sleep, wait } from "./utils"

describe("Sign up snackbar", function () {
    jest.setTimeout(180000)

    test("Hide snackbar", async () => {
        await login()
        await sleep(SIGN_IN_SNACKBAR_SHOW_DELAY + 1000)
        await wait("full-sign-in-snack-bar", { hidden: true, visible: false })
        await wait("dense-sign-in-snack-bar", { hidden: true, visible: false })
    })
    test("Show full snackbar", async () => {
        await signOut()
        await sleep(SIGN_IN_SNACKBAR_SHOW_DELAY)
        await wait("full-sign-in-snack-bar")
    })
    test("Show dense snackbar", async () => {
        await click("full-sign-in-snack-bar-close-button")
        await wait("dense-sign-in-snack-bar")
        await wait("full-sign-in-snack-bar", { hidden: true, visible: false })
    })
    test("Click dense snackbar button", async () => {
        await click("dense-sign-in-snack-bar-button")
        await wait("full-sign-in-snack-bar")
    })
    test("Jump to sign up page", async () => {
        await click("full-sign-in-snack-bar-sign-up-button")
        await wait("login-form-card")
    })
})
