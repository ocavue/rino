import { goto, wait } from "./utils"

// TODO: run this test before others
describe("Smoke test", function() {
    test("Sidebar", async () => {
        await goto("/")
        await wait("sidebar")
        await wait("appbar")
        await wait("main")
    })
})
