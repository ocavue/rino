import { getCookie, setCookie } from "../cookie"

test("cookie", async () => {
    setCookie("my-key", "my-value")
    expect(getCookie("my-key")).toEqual("my-value")

    setCookie("my-key", "my-new-value")
    expect(getCookie("my-key")).toEqual("my-new-value")
})
