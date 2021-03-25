/* Copyright (c) 2020-present ocavue@gmail.com */

import { getCookie, setCookie } from "../cookie"

test("cookie", async () => {
    setCookie("my-key", "my-value", { days: 30 })
    expect(getCookie("my-key")).toEqual("my-value")

    setCookie("my-key", "my-new-value", { days: 30 })
    expect(getCookie("my-key")).toEqual("my-new-value")
})
