import { goto, retry, wait } from "./utils"

beforeAll(async () => {
    await goto("/")
})

describe("Check main components", function() {
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

describe("Check HTML header", function() {
    test("title", async () => {
        const match = await retry(async () => {
            return (await page.title()) === "Rino"
        })
        if (!match) {
            expect(await page.title()).toEqual("Rino")
        }
    })
})
