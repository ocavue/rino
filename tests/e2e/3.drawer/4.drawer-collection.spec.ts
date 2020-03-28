import { goto, wait } from "../utils"
import { login } from "../actions"

describe("Before login", function() {
    beforeAll(async () => {
        await jestPuppeteer.resetBrowser()
        await goto("/")
    })

    test("Show collection", async () => {
        await wait("drawer-collection-item-key:inbox")
        await wait("drawer-collection-item-key:trash")
    })
})

describe("After login", function() {
    beforeAll(async () => {
        await jestPuppeteer.resetBrowser()
        await login()
    })

    test("Show collection", async () => {
        await wait("drawer-collection-item-key:inbox")
        await wait("drawer-collection-item-key:trash")
    })
})
