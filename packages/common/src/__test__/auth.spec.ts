/* Copyright (c) 2020-present ocavue@gmail.com */

import { getSignInState, setSignInState } from "../auth"

test("auth", async () => {
    setSignInState(true)
    expect(getSignInState()).toBe(true)

    setSignInState(false)
    expect(getSignInState()).toBe(false)
})
