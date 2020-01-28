import { click, sleep, wait } from "./utils"
import { login, signOut } from "./actions"
import { signInSnackbarDelay } from "src/constants"

describe("Sign up snackbar", function() {
    test("Hide snackbar", async () => {
        await login()
        await sleep(signInSnackbarDelay + 1000)
        await wait("sign-in-snack-bar", { hidden: true, visible: false })
    })
    test("Show snackbar", async () => {
        await signOut()
        await sleep(signInSnackbarDelay)
        await wait("sign-in-snack-bar")
    })
    test("Click snackbar button", async () => {
        await click("sign-in-snack-bar-button")
        await wait("login-form-card")
    })
})
