import { login } from "./actions"
import { goto, wait } from "./utils"

beforeAll(async () => {
    await goto("/")
})

describe("before sign-in", function () {
    test("landing page", async () => {
        await wait("landing")
    })
})

describe("after sign-in", function () {
    test("sign-in", async () => {
        await login()
    })

    describe("Check main components", function () {
        test("Drawer", async () => {
            await wait("sidebar")
        })
        test("Appbar", async () => {
            await wait("appbar")
        })
        test("Main", async () => {
            await wait("main")
        })
    })

    describe("Check HTML header", function () {
        test("title", async () => {
            await wait("main") // Wait the page
            expect(await page.title()).toEqual("Rino")
        })
    })
})
