import { login } from "./actions"
import { click, goto, retry, wait } from "./utils"

beforeAll(async () => {
    await goto("/")
})

describe("before sign-in", function () {
    test("landing page", async () => {
        await wait("landing")
    })

    test("click sign-in button", async () => {
        await goto("/")
        const url = new URL(page.url())
        const expectedSignInUrls = [url.origin + "/sign-in", url.origin + "/sign-in/"]
        await click("landing_signin_btn")
        await retry(() => expectedSignInUrls.includes(page.url()))
    })

    test("click sign-up button", async () => {
        await goto("/")
        const url = new URL(page.url())
        const expectedSignInUrls = [url.origin + "/sign-up", url.origin + "/sign-up/"]
        await click("landing_signup_btn")
        await retry(() => expectedSignInUrls.includes(page.url()))
    })
})

describe("after sign-in", function () {
    test("sign-in", async () => {
        await login()
    })

    test("core components", async function () {
        await wait("sidebar")
        await wait("appbar")
        await wait("main")
    })

    describe("HTML header", function () {
        test("title", async () => {
            await wait("main") // Wait the page
            expect(await page.title()).toEqual("Rino")
        })
    })
})
