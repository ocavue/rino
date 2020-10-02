import { getSignInState, setSignInState } from "../auth"

test("auth", async () => {
    setSignInState(true)
    expect(getSignInState()).toBe(true)

    setSignInState(false)
    expect(getSignInState()).toBe(false)
})
