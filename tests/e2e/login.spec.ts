import { expectSignedIn, login } from "./actions"

describe("Sign-in", function() {
    test("Automatically sign in", async () => {
        await login()
    })

    test("After signed in", async () => {
        await expectSignedIn()
    })
})
