import { goto, wait } from "./utils"

describe("Smooth test", function() {
    test("Sidebar", async () => {
        await goto("/this-page-does-not-exist")
        await wait("404-not-found")
    })
})
