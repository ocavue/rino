import { goto, wait } from "./utils"

test("404 page", async () => {
    await goto("/this-page-does-not-exist")
    await wait("404-not-found")
})
