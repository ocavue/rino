import { login } from "../actions"
import { wait } from "../utils"

describe("After login", function () {
    beforeAll(async () => {
        await jestPuppeteer.resetBrowser()
        await login()
    })

    test("Show collection", async () => {
        await wait("drawer-collection-item-key:inbox")
        await wait("drawer-collection-item-key:trash")
    })
})
