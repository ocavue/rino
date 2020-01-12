import { goto, wait } from "./utils"

// TODO: run this test before others
describe("Smoke test", function() {
    beforeAll(async () => {
        await goto("/")
    })

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
